<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    use ApiResponse;

    /**
     * Add product to cart or update quantity if already exists
     */
    public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        try {
            $user = Auth::user();
            $product = Product::findOrFail($validated['product_id']);

            // Check if product is in stock
            if ($product->stock < $validated['quantity']) {
                return $this->error('Not enough stock available', 400);
            }

            DB::beginTransaction();

            // Check if product is already in cart
            $cartItem = Cart::where('user_id', $user->id)
                            ->where('product_id', $validated['product_id'])
                            ->first();

            if ($cartItem) {
                // If already in cart, update quantity
                $newQuantity = $cartItem->quantity + $validated['quantity'];
                
                // Check if total quantity exceeds available stock
                if ($product->stock < $newQuantity) {
                    DB::rollBack();
                    return $this->error('Adding this quantity would exceed available stock', 400);
                }
                
                $cartItem->update(['quantity' => $newQuantity]);
            } else {
                // If not in cart, create new entry
                Cart::create([
                    'user_id' => $user->id,
                    'product_id' => $validated['product_id'],
                    'quantity' => $validated['quantity'],
                ]);
            }

            DB::commit();
            return $this->success(null, 'Product added to cart successfully');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to add product to cart', 500, $e->getMessage());
        }
    }

    /**
     * View cart with calculated totals
     */
    public function viewCart()
    {
        try {
            $user = Auth::user();

            $cartItems = Cart::with(['product' => function($query) {
                $query->select('id', 'title', 'price', 'image_url', 'stock');
            }])
            ->where('user_id', $user->id)
            ->get();

            // Calculate totals
            $subtotal = 0;
            $items = [];
            
            foreach ($cartItems as $item) {
                $itemTotal = $item->quantity * $item->product->price;
                $subtotal += $itemTotal;
                
                $items[] = [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'title' => $item->product->title,
                    'price' => $item->product->price,
                    'image_url' => $item->product->image_url,
                    'quantity' => $item->quantity,
                    'item_total' => $itemTotal,
                    'available_stock' => $item->product->stock
                ];
            }

            // Calculate tax and total (example: 12% tax)
            $taxRate = 0.12;
            $tax = $subtotal * $taxRate;
            $total = $subtotal + $tax;

            $cartData = [
                'items' => $items,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'tax_rate' => $taxRate * 100, // as percentage
                'total' => $total,
                'item_count' => count($items)
            ];

            return $this->success($cartData);
            
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve cart', 500, $e->getMessage());
        }
    }

    /**
     * Remove item from cart
     */
    public function removeFromCart($id)
    {
        try {
            $user = Auth::user();

            $cartItem = Cart::where('id', $id)
                            ->where('user_id', $user->id)
                            ->firstOrFail();

            $cartItem->delete();

            return $this->success(null, 'Item removed from cart');
            
        } catch (\Exception $e) {
            return $this->error('Failed to remove item from cart', 500, $e->getMessage());
        }
    }

    /**
     * Update cart item quantity
     */
    public function updateQuantity(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        try {
            $user = Auth::user();
            
            $cartItem = Cart::with('product')
                          ->where('id', $id)
                          ->where('user_id', $user->id)
                          ->firstOrFail();

            // Check if requested quantity is available in stock
            if ($cartItem->product->stock < $validated['quantity']) {
                return $this->error('Not enough stock available', 400);
            }

            $cartItem->update(['quantity' => $validated['quantity']]);

            return $this->success(null, 'Cart updated successfully');
            
        } catch (\Exception $e) {
            return $this->error('Failed to update cart', 500, $e->getMessage());
        }
    }

    /**
     * Checkout and create order
     */
    public function checkout(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Get cart items with product details
            $cartItems = Cart::with('product')
                           ->where('user_id', $user->id)
                           ->get();

            if ($cartItems->isEmpty()) {
                return $this->error('Your cart is empty', 400);
            }

            // Validate stock and calculate total
            $total = 0;
            $orderItems = [];
            
            foreach ($cartItems as $item) {
                if ($item->quantity > $item->product->stock) {
                    return $this->error("Not enough stock for product: {$item->product->title}", 400);
                }
                
                $itemTotal = $item->quantity * $item->product->price;
                $total += $itemTotal;
                
                $orderItems[] = [
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                    'total' => $itemTotal
                ];
            }

            // Start transaction
            DB::beginTransaction();

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'payment_method' => $request->payment_method,
            ]);

            // Create order items
            foreach ($orderItems as &$item) {
                $item['order_id'] = $order->id;
                
                // Reduce product stock
                $product = Product::find($item['product_id']);
                $product->decrement('stock', $item['quantity']);
            }
            
            OrderItem::insert($orderItems);
            
            // Clear cart
            Cart::where('user_id', $user->id)->delete();

            DB::commit();
            
            // Here you would typically integrate with a payment gateway
            // For now, we'll just mark the order as paid
            $order->update(['status' => 'processing']);
            
            return $this->success([
                'order_id' => $order->id,
                'status' => $order->status,
                'total' => $order->total,
                'message' => 'Order placed successfully'
            ], 'Order placed successfully', 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to process order', 500, $e->getMessage());
        }
    }
}
