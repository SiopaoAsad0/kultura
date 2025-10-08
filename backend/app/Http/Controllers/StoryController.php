<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Http\Requests\StoryRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoryController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of stories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Story::query();

        // Filter by status (default to published)
        $status = $request->input('status', 'published');
        if ($status === 'all') {
            // Show all for admin users
        } else {
            $query->where('status', $status);
        }

        // Filter by category
        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        // Filter by featured
        if ($request->has('featured')) {
            $query->where('is_featured', $request->boolean('featured'));
        }

        // Search by title, excerpt, or content
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('author_name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Filter by tags
        if ($tags = $request->input('tags')) {
            $tags = is_array($tags) ? $tags : explode(',', $tags);
            $query->where(function($q) use ($tags) {
                foreach ($tags as $tag) {
                    $q->orWhereJsonContains('tags', trim($tag));
                }
            });
        }

        // Sort results
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_dir', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate results
        $perPage = $request->input('per_page', 12);
        $stories = $query->paginate($perPage);

        return $this->success($stories);
    }

    /**
     * Store a newly created story.
     */
    public function store(StoryRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            
            // Handle featured image upload
            if ($request->hasFile('featured_image')) {
                $path = $request->file('featured_image')->store('stories/featured', 'public');
                $data['featured_image'] = $path;
            }

            // Handle gallery images
            $galleryImages = [];
            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $image) {
                    $path = $image->store('stories/gallery', 'public');
                    $galleryImages[] = $path;
                }
                $data['gallery_images'] = $galleryImages;
            }

            // Generate slug if not provided
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $story = Story::create($data);

            return $this->success($story, 'Story created successfully', 201);
        } catch (\Exception $e) {
            return $this->error('Failed to create story: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified story.
     */
    public function show(Story $story): JsonResponse
    {
        // Increment view count
        $story->increment('views_count');

        return $this->success($story);
    }

    /**
     * Update the specified story.
     */
    public function update(StoryRequest $request, Story $story): JsonResponse
    {
        try {
            $data = $request->validated();

            // Handle featured image update
            if ($request->hasFile('featured_image')) {
                // Delete old featured image
                if ($story->featured_image) {
                    Storage::disk('public')->delete($story->featured_image);
                }
                
                $path = $request->file('featured_image')->store('stories/featured', 'public');
                $data['featured_image'] = $path;
            }

            // Handle gallery images update
            if ($request->hasFile('gallery_images')) {
                // Delete old gallery images
                if ($story->gallery_images) {
                    foreach ($story->gallery_images as $image) {
                        Storage::disk('public')->delete($image);
                    }
                }
                
                // Upload new gallery images
                $galleryImages = [];
                foreach ($request->file('gallery_images') as $image) {
                    $path = $image->store('stories/gallery', 'public');
                    $galleryImages[] = $path;
                }
                $data['gallery_images'] = $galleryImages;
            }

            // Update slug if title changed
            if ($request->has('title') && $story->title !== $data['title']) {
                $data['slug'] = Str::slug($data['title']);
            }

            $story->update($data);

            return $this->success($story->fresh(), 'Story updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update story: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified story.
     */
    public function destroy(Story $story): JsonResponse
    {
        try {
            // Delete associated images
            if ($story->featured_image) {
                Storage::disk('public')->delete($story->featured_image);
            }
            
            if ($story->gallery_images) {
                foreach ($story->gallery_images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
            
            $story->delete();
            
            return $this->success(null, 'Story deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete story: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get featured stories.
     */
    public function featured(): JsonResponse
    {
        $stories = Story::published()
            ->featured()
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        return $this->success($stories);
    }

    /**
     * Get Cordillera stories.
     */
    public function cordillera(): JsonResponse
    {
        $stories = Story::published()
            ->cordillera()
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return $this->success($stories);
    }

    /**
     * Like a story.
     */
    public function like(Story $story): JsonResponse
    {
        $story->increment('likes_count');
        
        return $this->success([
            'likes_count' => $story->likes_count
        ], 'Story liked successfully');
    }
}
