<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // Add product to cart
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $user = Auth::user();

        // Check if product is already in cart
        $cartItem = Cart::where('user_id', $user->id)
                        ->where('product_id', $request->product_id)
                        ->first();

        if ($cartItem) {
            // If already in cart, increase quantity
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // If not in cart, create new entry
            Cart::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json([
            'message' => 'Product added to cart successfully'
        ]);
    }

    // Optional: view cart
    public function viewCart()
    {
        $user = Auth::user();

        $cartItems = Cart::with('product')
                        ->where('user_id', $user->id)
                        ->get();

        return response()->json($cartItems);
    }

    // Optional: remove from cart
    public function removeFromCart($id)
    {
        $user = Auth::user();

        $cartItem = Cart::where('id', $id)
                        ->where('user_id', $user->id)
                        ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Item not found in cart'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }
}
