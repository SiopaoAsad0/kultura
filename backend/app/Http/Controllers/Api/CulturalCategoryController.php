<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CulturalCategoryRequest;
use App\Models\CulturalCategory;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CulturalCategoryController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of cultural categories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = CulturalCategory::query();

        // Filter by endangered status
        if ($request->has('endangered')) {
            $query->where('is_endangered', $request->boolean('endangered'));
        }

        // Filter by skill level
        if ($request->has('skill_level')) {
            $query->whereIn('skill_level', (array)$request->input('skill_level'));
        }

        // Search by name or description
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('heritage_origin', 'like', "%{$search}%");
            });
        }

        // Sort results
        $sortField = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_dir', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $perPage = $request->input('per_page', 10);
        $categories = $query->paginate($perPage);

        return $this->success($categories);
    }

    /**
     * Store a newly created cultural category.
     */
    public function store(CulturalCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $this->createUniqueSlug($data['name']);

        // Handle icon upload
        if ($request->hasFile('icon')) {
            $data['icon'] = $request->file('icon')->store('cultural-categories/icons', 'public');
        }

        // Handle banner image upload
        if ($request->hasFile('banner_image')) {
            $data['banner_image'] = $request->file('banner_image')
                ->store('cultural-categories/banners', 'public');
        }

        $category = CulturalCategory::create($data);

        return $this->success($category, 'Cultural category created successfully', 201);
    }

    /**
     * Display the specified cultural category.
     */
    public function show(CulturalCategory $culturalCategory): JsonResponse
    {
        return $this->success($culturalCategory->load('products'));
    }

    /**
     * Update the specified cultural category.
     */
    public function update(CulturalCategoryRequest $request, CulturalCategory $culturalCategory): JsonResponse
    {
        $data = $request->validated();

        // Update slug if name changed
        if ($request->has('name') && $culturalCategory->name !== $data['name']) {
            $data['slug'] = $this->createUniqueSlug($data['name']);
        }

        // Handle icon update
        if ($request->hasFile('icon')) {
            // Delete old icon
            if ($culturalCategory->icon) {
                Storage::disk('public')->delete($culturalCategory->icon);
            }
            $data['icon'] = $request->file('icon')->store('cultural-categories/icons', 'public');
        }

        // Handle banner image update
        if ($request->hasFile('banner_image')) {
            // Delete old banner
            if ($culturalCategory->banner_image) {
                Storage::disk('public')->delete($culturalCategory->banner_image);
            }
            $data['banner_image'] = $request->file('banner_image')
                ->store('cultural-categories/banners', 'public');
        }

        $culturalCategory->update($data);

        return $this->success($culturalCategory->fresh(), 'Cultural category updated successfully');
    }

    /**
     * Remove the specified cultural category.
     */
    public function destroy(CulturalCategory $culturalCategory): JsonResponse
    {
        // Prevent deletion if category has products
        if ($culturalCategory->products()->exists()) {
            return $this->error(
                'Cannot delete category with associated products. Please reassign or delete the products first.',
                422
            );
        }

        // Delete associated files
        if ($culturalCategory->icon) {
            Storage::disk('public')->delete($culturalCategory->icon);
        }
        if ($culturalCategory->banner_image) {
            Storage::disk('public')->delete($culturalCategory->banner_image);
        }

        $culturalCategory->delete();

        return $this->success(null, 'Cultural category deleted successfully');
    }

    /**
     * Create a unique slug for the category.
     */
    protected function createUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $count = CulturalCategory::where('slug', 'like', "{$slug}%")->count();
        
        return $count ? "{$slug}-{$count}" : $slug;
    }
}
