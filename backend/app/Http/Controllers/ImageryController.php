<?php

namespace App\Http\Controllers;

use App\Models\Imagery;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ImageryController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Imagery::query();

            // Filter by category
            if ($category = $request->input('category')) {
                $query->where('category', $category);
            }

            // Filter by status
            if ($status = $request->input('status')) {
                $query->where('status', $status);
            } else {
                $query->where('status', 'active');
            }

            // Filter by public visibility
            $query->where('is_public', true);

            // Search by title or description
            if ($search = $request->input('search')) {
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('tags', 'like', "%{$search}%");
                });
            }

            $imageries = $query->orderBy('created_at', 'desc')
                              ->paginate(12);

            // Add computed fields
            $imageries->getCollection()->transform(function ($imagery) {
                $imagery->image_url = $imagery->file_path ? Storage::url($imagery->file_path) : null;
                return $imagery;
            });

            return $this->success($imageries);
        } catch (\Exception $e) {
            return $this->error('Failed to fetch imageries', 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'required|string|in:textiles,crafts,festivals,people,landscape',
                'location' => 'nullable|string|max:255',
                'photographer_name' => 'required|string|max:255',
                'photographer_email' => 'required|email',
                'photographer_bio' => 'nullable|string',
                'tags' => 'nullable|array',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
            ]);

            if ($validator->fails()) {
                return $this->error('Validation failed', 422, $validator->errors());
            }

            $data = $request->all();
            $data['user_id'] = $user->id;
            $data['status'] = 'pending';
            $data['is_public'] = true;

            // Handle image upload
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('imageries', 'public');
                $data['file_path'] = $path;
                $data['file_name'] = $request->file('image')->getClientOriginalName();
                $data['file_type'] = $request->file('image')->getMimeType();
                $data['file_size'] = $request->file('image')->getSize();
                
                // Get image dimensions
                $imageInfo = getimagesize($request->file('image')->path());
                if ($imageInfo) {
                    $data['width'] = $imageInfo[0];
                    $data['height'] = $imageInfo[1];
                }
            }

            $imagery = Imagery::create($data);

            return $this->success($imagery, 'Image uploaded successfully', 201);
        } catch (\Exception $e) {
            return $this->error('Failed to upload image', 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $imagery = Imagery::where('id', $id)
                            ->orWhere('slug', $id)
                            ->where('is_public', true)
                            ->firstOrFail();

            // Add computed fields
            $imagery->image_url = $imagery->file_path ? Storage::url($imagery->file_path) : null;

            // Increment view count
            $imagery->increment('views_count');

            return $this->success($imagery);
        } catch (\Exception $e) {
            return $this->error('Image not found', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $imagery = Imagery::findOrFail($id);

            if ($user->id !== $imagery->user_id) {
                return $this->error('Unauthorized', 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'category' => 'sometimes|string|in:textiles,crafts,festivals,people,landscape',
                'location' => 'nullable|string|max:255',
                'photographer_name' => 'sometimes|string|max:255',
                'photographer_email' => 'sometimes|email',
                'photographer_bio' => 'nullable|string',
                'tags' => 'nullable|array',
                'status' => 'sometimes|string|in:pending,active,rejected',
                'is_public' => 'sometimes|boolean',
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:10240',
            ]);

            if ($validator->fails()) {
                return $this->error('Validation failed', 422, $validator->errors());
            }

            $data = $request->all();

            // Handle image update
            if ($request->hasFile('image')) {
                // Delete old image
                if ($imagery->file_path) {
                    Storage::disk('public')->delete($imagery->file_path);
                }

                $path = $request->file('image')->store('imageries', 'public');
                $data['file_path'] = $path;
                $data['file_name'] = $request->file('image')->getClientOriginalName();
                $data['file_type'] = $request->file('image')->getMimeType();
                $data['file_size'] = $request->file('image')->getSize();
                
                // Get image dimensions
                $imageInfo = getimagesize($request->file('image')->path());
                if ($imageInfo) {
                    $data['width'] = $imageInfo[0];
                    $data['height'] = $imageInfo[1];
                }
            }

            $imagery->update($data);

            return $this->success($imagery, 'Image updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update image', 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            $imagery = Imagery::findOrFail($id);

            if ($user->id !== $imagery->user_id) {
                return $this->error('Unauthorized', 403);
            }

            // Delete image file
            if ($imagery->file_path) {
                Storage::disk('public')->delete($imagery->file_path);
            }

            $imagery->delete();

            return $this->success(null, 'Image deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete image', 500);
        }
    }

    /**
     * Get Cordillera-specific imageries.
     */
    public function cordillera()
    {
        try {
            $imageries = Imagery::where('category', 'cordillera')
                              ->orWhere('location', 'like', '%cordillera%')
                              ->orWhere('title', 'like', '%cordillera%')
                              ->orWhere('tags', 'like', '%cordillera%')
                              ->where('is_public', true)
                              ->where('status', 'active')
                              ->orderBy('created_at', 'desc')
                              ->paginate(12);

            // Add computed fields
            $imageries->getCollection()->transform(function ($imagery) {
                $imagery->image_url = $imagery->file_path ? Storage::url($imagery->file_path) : null;
                return $imagery;
            });

            return $this->success($imageries);
        } catch (\Exception $e) {
            return $this->error('Failed to fetch Cordillera imageries', 500);
        }
    }
}