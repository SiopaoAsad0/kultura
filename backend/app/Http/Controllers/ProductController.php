<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\ProductRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the products with pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->with(['weaver:id,name', 'culturalCategory']);
        
        // Search by title, story, or cultural attributes
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('story', 'like', "%{$search}%")
                  ->orWhere('materials_used', 'like', "%{$search}%")
                  ->orWhere('crafting_technique', 'like', "%{$search}%")
                  ->orWhere('heritage_origin', 'like', "%{$search}%")
                  ->orWhereHas('culturalCategory', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by price range
        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        // Filter by cultural category
        if ($category = $request->input('category')) {
            $query->whereHas('culturalCategory', function($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        // Filter by heritage origin
        if ($origin = $request->input('origin')) {
            $query->where('heritage_origin', $origin);
        }

        // Filter by materials used
        if ($materials = $request->input('materials')) {
            $materials = explode(',', $materials);
            foreach ($materials as $material) {
                $query->where('materials_used', 'like', "%{$material}%");
            }
        }

        // Filter by handmade status
        if ($request->has('handmade')) {
            $query->where('is_handmade', $request->boolean('handmade'));
        }

        // Filter by fair trade status
        if ($request->has('fair_trade')) {
            $query->where('is_fair_trade', $request->boolean('fair_trade'));
        }

        // Filter by stock availability
        if ($request->has('in_stock')) {
            $query->where('stock', '>', 0);
        }

        // Sort results
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_dir', 'desc');
        
        // Handle custom sorting for cultural attributes
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $perPage = $request->input('per_page', 12);
        $products = $query->paginate($perPage);

        return $this->success($products);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(ProductRequest $request): JsonResponse
    {
        try {
            $user = Auth::user();
            if ($user->role !== 'weaver') {
                return $this->error('Unauthorized', 403);
            }

            $data = $request->validated();
            $data['weaver_id'] = $user->id;

            // Handle main image upload
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('products', 'public');
                $data['image_url'] = Storage::url($path);
            }

            // Handle cultural images
            $culturalImages = [];
            if ($request->hasFile('cultural_images')) {
                foreach ($request->file('cultural_images') as $image) {
                    $path = $image->store('products/cultural', 'public');
                    $culturalImages[] = Storage::url($path);
                }
                $data['cultural_images'] = $culturalImages;
            }

            // Create the product
            $product = Product::create($data);

            return $this->success($product->load('culturalCategory'), 'Product created successfully', 201);
        } catch (\Exception $e) {
            // Clean up any uploaded files if there was an error
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }
            if (!empty($culturalImages)) {
                foreach ($culturalImages as $image) {
                    $imagePath = str_replace('/storage', 'public', $image);
                    Storage::delete($imagePath);
                }
            }
            
            return $this->error('Failed to create product: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified product.
     */
    public function show($id): JsonResponse
    {
        try {
            $product = Product::with('weaver:id,name,email')->findOrFail($id);
            return $this->success($product);
        } catch (\Exception $e) {
            return $this->error('Product not found', 404);
        }
    }

    /**
     * Update the specified product in storage.
     */
    public function update(ProductRequest $request, $id): JsonResponse
    {
        try {
            $user = Auth::user();
            $product = Product::findOrFail($id);

            if ($user->role !== 'weaver' || $product->weaver_id !== $user->id) {
                return $this->error('Unauthorized', 403);
            }

            $data = $request->validated();
            $oldImages = [];

            // Handle main image update
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($product->image_url) {
                    $oldImage = str_replace('/storage', 'public', $product->image_url);
                    Storage::delete($oldImage);
                }
                
                $path = $request->file('image')->store('products', 'public');
                $data['image_url'] = Storage::url($path);
            }

            // Handle cultural images update
            if ($request->hasFile('cultural_images')) {
                // Store old images for cleanup
                $oldImages = $product->cultural_images ?? [];
                
                // Upload new cultural images
                $culturalImages = [];
                foreach ($request->file('cultural_images') as $image) {
                    $path = $image->store('products/cultural', 'public');
                    $culturalImages[] = Storage::url($path);
                }
                $data['cultural_images'] = $culturalImages;
            }

            // Update the product
            $product->update($data);

            // Clean up old cultural images after successful update
            if (!empty($oldImages)) {
                foreach ($oldImages as $oldImage) {
                    $oldImagePath = str_replace('/storage', 'public', $oldImage);
                    Storage::delete($oldImagePath);
                }
            }

            return $this->success($product->load('culturalCategory'), 'Product updated successfully');
        } catch (\Exception $e) {
            // Clean up any newly uploaded files if there was an error
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }
            if (isset($culturalImages)) {
                foreach ($culturalImages as $image) {
                    $imagePath = str_replace('/storage', 'public', $image);
                    Storage::delete($imagePath);
                }
            }
            
            return $this->error('Failed to update product: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $user = Auth::user();
            $product = Product::findOrFail($id);

            if ($user->role !== 'weaver' || $product->weaver_id !== $user->id) {
                return $this->error('Unauthorized', 403);
            }
            
            // Delete associated main image
            if ($product->image_url) {
                $imagePath = str_replace('/storage', 'public', $product->image_url);
                Storage::delete($imagePath);
            }
            
            // Delete associated cultural images
            if (!empty($product->cultural_images)) {
                foreach ($product->cultural_images as $image) {
                    $imagePath = str_replace('/storage', 'public', $image);
                    Storage::delete($imagePath);
                }
            }
            
            $product->delete();
            
            return $this->success(null, 'Product deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete product: ' . $e->getMessage(), 500);
        }
    }
}
