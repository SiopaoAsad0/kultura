<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the orders for the authenticated user.
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            $orders = Order::with(['items', 'user' => function($query) {
                $query->select('id', 'name', 'email');
            }])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

            return $this->success($orders);
            
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve orders', 500, $e->getMessage());
        }
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            
            $order = Order::with(['items', 'user' => function($query) {
                $query->select('id', 'name', 'email');
            }])
            ->where('user_id', $user->id)
            ->findOrFail($id);

            return $this->success($order);
            
        } catch (\Exception $e) {
            return $this->error('Order not found', 404);
        }
    }

    /**
     * Update the specified order status (for admin/weaver).
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string|max:1000'
        ]);

        try {
            $user = Auth::user();
            
            // Only allow weavers to update their own orders
            $order = Order::whereHas('items.product', function($query) use ($user) {
                $query->where('weaver_id', $user->id);
            })
            ->findOrFail($id);

            // Update status
            $order->update([
                'status' => $validated['status'],
                'notes' => $validated['notes'] ?? $order->notes
            ]);

            return $this->success($order, 'Order status updated successfully');
            
        } catch (\Exception $e) {
            return $this->error('Failed to update order status', 500, $e->getMessage());
        }
    }

    /**
     * Cancel an order (for customers).
     */
    public function cancel($id)
    {
        try {
            $user = Auth::user();
            
            $order = Order::where('user_id', $user->id)
                        ->where('status', '!=', 'cancelled')
                        ->findOrFail($id);

            // Check if order can be cancelled (e.g., not already shipped)
            if (in_array($order->status, ['shipped', 'delivered'])) {
                return $this->error('Cannot cancel order that is already ' . $order->status, 400);
            }

            // Update status to cancelled
            $order->update([
                'status' => 'cancelled',
                'notes' => 'Cancelled by customer.'
            ]);

            // Restore product stock
            foreach ($order->items as $item) {
                $product = $item->product;
                $product->increment('stock', $item->quantity);
            }

            return $this->success($order, 'Order has been cancelled');
            
        } catch (\Exception $e) {
            return $this->error('Failed to cancel order', 500, $e->getMessage());
        }
    }
}
