<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    // Show all products (accessible to everyone)
    public function index() {
        return response()->json(Product::all());
    }

    // Show a single product
    public function show($id) {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json($product);
    }

    // Store a new product (weaver only)
    public function store(Request $request) {
        
        $user = Auth::user();
        if ($user->role !== 'weaver') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string',
            'story' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer'
        ]);

        $product = Product::create(array_merge($validated, ['weaver_id' => $user->id]));

        return response()->json($product);
    }

    // Update a product (weaver only)
    public function update(Request $request, $id) {
        $user = Auth::user();
        $product = Product::findOrFail($id);

        if ($user->role !== 'weaver' || $product->weaver_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->update($request->only(['title','story','price','stock']));

        return response()->json($product);
    }
    

    // Delete a product (weaver only)
    public function destroy($id) {
        $user = Auth::user();
        $product = Product::findOrFail($id);

        if ($user->role !== 'weaver' || $product->weaver_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
