<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Block weavers from creating orders
            if ($user->role === 'weaver') {
                return $this->error('Weavers cannot create orders. This feature is for customers only.', 403);
            }
            
            // Validate request
            $validated = $request->validate([
                'shipping_address' => 'required|string|max:500',
                'contact_number' => 'required|string|max:20',
                'notes' => 'nullable|string|max:1000',
                'payment_method' => 'required|string|in:cash_on_delivery,bank_transfer,digital_wallet'
            ]);

            // Get cart items
            $cartItems = Cart::with('product')
                           ->where('user_id', $user->id)
                           ->get();

            if ($cartItems->isEmpty()) {
                return $this->error('Your cart is empty', 400);
            }

            // Validate stock and calculate total
            $subtotal = 0;
            $orderItems = [];
            
            foreach ($cartItems as $item) {
                if ($item->quantity > $item->product->stock) {
                    return $this->error("Not enough stock for product: {$item->product->title}", 400);
                }
                
                $itemTotal = $item->quantity * $item->product->price;
                $subtotal += $itemTotal;
                
                $orderItems[] = [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->title,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                    'total' => $itemTotal
                ];
            }

            // Calculate tax (12% VAT)
            $taxRate = 0.12;
            $tax = $subtotal * $taxRate;
            $total = $subtotal + $tax;

            // Start transaction
            DB::beginTransaction();

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => $validated['payment_method'],
                'shipping_address' => $validated['shipping_address'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create order items and reduce stock
            foreach ($orderItems as &$item) {
                $item['order_id'] = $order->id;
                
                // Reduce product stock
                $product = \App\Models\Product::find($item['product_id']);
                $product->decrement('stock', $item['quantity']);
            }
            
            OrderItem::insert($orderItems);
            
            // Clear cart
            Cart::where('user_id', $user->id)->delete();

            DB::commit();
            
            // Load the order with items for response
            $order->load(['items.product']);
            
            return $this->success([
                'order' => $order,
                'message' => 'Order placed successfully'
            ], 'Order placed successfully', 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to place order: ' . $e->getMessage(), 500);
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
