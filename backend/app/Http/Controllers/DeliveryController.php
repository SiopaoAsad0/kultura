<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Rider;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

/**
 * DeliveryController powers the admin Order/Delivery Management System.
 *
 * This is a LOCAL SIMULATION: there is no real-world courier integration.
 * Admins manage a pool of simulated riders, assign them to orders, and move
 * each order through a delivery lifecycle. It also exposes payment records,
 * transaction history, and high-level reports derived from existing orders.
 */
class DeliveryController extends Controller
{
    use ApiResponse;

    protected function ensureAdmin()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return null;
        }
        return $user;
    }

    /* -----------------------------------------------------------------
     |  Riders
     * -----------------------------------------------------------------
     */

    public function riders(Request $request)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        $riders = Rider::withCount(['orders' => function ($q) {
            $q->where('delivery_status', '!=', Order::DELIVERY_DELIVERED);
        }])->orderBy('name')->get();

        return $this->success($riders);
    }

    public function storeRider(Request $request)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'phone'        => 'required|string|max:32',
            'vehicle_type' => 'required|in:motorcycle,bicycle,van,car',
            'plate_number' => 'nullable|string|max:32',
            'status'       => 'sometimes|in:available,on_delivery,offline',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $rider = Rider::create($request->all());

        return $this->success($rider, 'Rider added successfully', 201);
    }

    public function updateRider(Request $request, $id)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        $rider = Rider::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name'         => 'sometimes|string|max:255',
            'phone'        => 'sometimes|string|max:32',
            'vehicle_type' => 'sometimes|in:motorcycle,bicycle,van,car',
            'plate_number' => 'nullable|string|max:32',
            'status'       => 'sometimes|in:available,on_delivery,offline',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $rider->update($request->all());

        return $this->success($rider->fresh(), 'Rider updated successfully');
    }

    public function destroyRider(Request $request, $id)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        $rider = Rider::findOrFail($id);

        // Unassign any active deliveries before removing the rider.
        Order::where('rider_id', $rider->id)
            ->whereIn('delivery_status', [
                Order::DELIVERY_ASSIGNED,
                Order::DELIVERY_PICKED_UP,
                Order::DELIVERY_IN_TRANSIT,
            ])
            ->update([
                'rider_id'        => null,
                'delivery_status' => Order::DELIVERY_UNASSIGNED,
            ]);

        $rider->delete();

        return $this->success(null, 'Rider removed successfully');
    }

    /* -----------------------------------------------------------------
     |  Orders / Deliveries
     * -----------------------------------------------------------------
     */

    public function orders(Request $request)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        $query = Order::with(['items', 'user:id,name,email', 'rider:id,name,phone,vehicle_type']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }
        if ($delivery = $request->input('delivery_status')) {
            $query->where('delivery_status', $delivery);
        }
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('id', $search)
                  ->orWhere('transaction_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->latest()->paginate(15);

        return $this->success($orders);
    }

    public function assignRider(Request $request, $id)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        $validator = Validator::make($request->all(), [
            'rider_id' => 'required|exists:riders,id',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $order = Order::findOrFail($id);

        if ($order->delivery_status === Order::DELIVERY_DELIVERED) {
            return $this->error('This order has already been delivered', 400);
        }

        $rider = Rider::findOrFail($request->input('rider_id'));

        $order->update([
            'rider_id'        => $rider->id,
            'delivery_status' => Order::DELIVERY_ASSIGNED,
            'assigned_at'     => now(),
        ]);

        // Keep the rider's availability in sync (simulation).
        $rider->update(['status' => Rider::STATUS_ON_DELIVERY]);

        return $this->success(
            $order->load(['items', 'user:id,name,email', 'rider:id,name,phone,vehicle_type']),
            'Rider assigned successfully'
        );
    }

    public function updateDeliveryStatus(Request $request, $id)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        $validator = Validator::make($request->all(), [
            'delivery_status' => 'required|in:picked_up,in_transit,delivered,failed',
            'delivery_notes'  => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $order = Order::with('rider')->findOrFail($id);
        $newStatus = $request->input('delivery_status');

        $update = [
            'delivery_status' => $newStatus,
        ];

        if ($request->filled('delivery_notes')) {
            $update['delivery_notes'] = $request->input('delivery_notes');
        }

        // When delivered, mirror the main order status and record the time.
        if ($newStatus === Order::DELIVERY_DELIVERED) {
            $update['status'] = Order::STATUS_DELIVERED;
            $update['delivered_at'] = now();
            $update['payment_status'] = 'paid';
        }

        if ($newStatus === Order::DELIVERY_FAILED) {
            $update['status'] = Order::STATUS_CANCELLED;
        }

        $order->update($update);

        // If the rider has no more active deliveries, mark them available again.
        if ($order->rider_id) {
            $stillActive = Order::where('rider_id', $order->rider_id)
                ->whereIn('delivery_status', [
                    Order::DELIVERY_ASSIGNED,
                    Order::DELIVERY_PICKED_UP,
                    Order::DELIVERY_IN_TRANSIT,
                ])
                ->exists();

            if (!$stillActive && $order->rider) {
                $order->rider->update(['status' => Rider::STATUS_AVAILABLE]);
            }
        }

        return $this->success(
            $order->fresh(['items', 'user:id,name,email', 'rider:id,name,phone,vehicle_type']),
            'Delivery status updated successfully'
        );
    }

    /* -----------------------------------------------------------------
     |  Payments / Transactions / Reports
     * -----------------------------------------------------------------
     */

    public function payments(Request $request)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        $payments = Order::with('user:id,name,email')
            ->select('id', 'user_id', 'total', 'payment_status', 'payment_method', 'transaction_id', 'created_at')
            ->latest()
            ->paginate(15);

        return $this->success($payments);
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        $validator = Validator::make($request->all(), [
            'payment_status' => 'required|in:unpaid,paid,refunded,failed',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $order = Order::findOrFail($id);

        // Auto-generate a simple local transaction id when marking paid.
        $update = ['payment_status' => $request->input('payment_status')];
        if ($request->input('payment_status') === 'paid' && !$order->transaction_id) {
            $update['transaction_id'] = 'TXN-' . strtoupper(uniqid());
        }

        $order->update($update);

        return $this->success($order->fresh(), 'Payment status updated successfully');
    }

    public function reports(Request $request)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        $revenue = (float) Order::where('status', Order::STATUS_DELIVERED)->sum('total');

        $byStatus = Order::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $byDelivery = Order::select('delivery_status', DB::raw('COUNT(*) as count'))
            ->groupBy('delivery_status')
            ->pluck('count', 'delivery_status');

        $byPayment = Order::select('payment_status', DB::raw('COUNT(*) as count'))
            ->groupBy('payment_status')
            ->pluck('count', 'payment_status');

        $topProducts = \App\Models\OrderItem::select('product_name', DB::raw('SUM(quantity) as sold'), DB::raw('SUM(total) as revenue'))
            ->groupBy('product_name')
            ->orderByDesc('sold')
            ->limit(5)
            ->get();

        return $this->success([
            'revenue'      => $revenue,
            'total_orders' => Order::count(),
            'delivered'    => Order::where('status', Order::STATUS_DELIVERED)->count(),
            'pending'      => Order::where('status', Order::STATUS_PENDING)->count(),
            'cancelled'    => Order::where('status', Order::STATUS_CANCELLED)->count(),
            'by_status'    => $byStatus,
            'by_delivery'  => $byDelivery,
            'by_payment'   => $byPayment,
            'top_products' => $topProducts,
        ]);
    }
}
