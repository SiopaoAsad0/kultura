<?php

namespace App\Http\Controllers;

use App\Models\Fundraising;
use App\Models\Donation;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FundraisingController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Fundraising::query();

            // Filter by category
            if ($category = $request->input('category')) {
                $query->where('category', $category);
            }

            // Filter by status
            if ($status = $request->input('status')) {
                $query->where('status', $status);
            }

            // Search by title or description
            if ($search = $request->input('search')) {
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $fundraisings = $query->with('user:id,name')
                                 ->orderBy('created_at', 'desc')
                                 ->paginate(12);

            // Add computed fields
            $fundraisings->getCollection()->transform(function ($fundraising) {
                $fundraising->current_amount = $fundraising->donations()->sum('amount');
                $fundraising->donors_count = $fundraising->donations()->count();
                $fundraising->progress_percentage = $fundraising->target_amount > 0 
                    ? round(($fundraising->current_amount / $fundraising->target_amount) * 100, 2)
                    : 0;
                $fundraising->formatted_current_amount = '₱' . number_format($fundraising->current_amount, 2);
                $fundraising->formatted_target_amount = '₱' . number_format($fundraising->target_amount, 2);
                $fundraising->days_remaining = max(0, now()->diffInDays($fundraising->end_date, false));
                
                return $fundraising;
            });

            return $this->success($fundraisings);
        } catch (\Exception $e) {
            return $this->error('Failed to fetch fundraisings', 500);
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
                'description' => 'required|string',
                'full_description' => 'nullable|string',
                'category' => 'required|string|in:education,health,preservation,community',
                'target_amount' => 'required|numeric|min:1000',
                'end_date' => 'required|date|after:today',
                'location' => 'nullable|string|max:255',
                'organizer_name' => 'required|string|max:255',
                'organizer_email' => 'required|email',
                'organizer_phone' => 'nullable|string',
                'featured_image_url' => 'nullable|url',
            ]);

            if ($validator->fails()) {
                return $this->error('Validation failed', 422, $validator->errors());
            }

            $data = $request->all();
            $data['user_id'] = $user->id;
            $data['slug'] = \Str::slug($request->title);
            $data['status'] = 'pending';

            $fundraising = Fundraising::create($data);

            return $this->success($fundraising, 'Fundraising campaign created successfully', 201);
        } catch (\Exception $e) {
            return $this->error('Failed to create fundraising campaign', 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        try {
            $fundraising = Fundraising::where('slug', $slug)
                                    ->orWhere('id', $slug)
                                    ->with('user:id,name')
                                    ->firstOrFail();

            // Add computed fields
            $fundraising->current_amount = $fundraising->donations()->sum('amount');
            $fundraising->donors_count = $fundraising->donations()->count();
            $fundraising->progress_percentage = $fundraising->target_amount > 0 
                ? round(($fundraising->current_amount / $fundraising->target_amount) * 100, 2)
                : 0;
            $fundraising->formatted_current_amount = '₱' . number_format($fundraising->current_amount, 2);
            $fundraising->formatted_target_amount = '₱' . number_format($fundraising->target_amount, 2);
            $fundraising->days_remaining = max(0, now()->diffInDays($fundraising->end_date, false));

            // Get recent donations
            $fundraising->recent_donations = $fundraising->donations()
                ->with('user:id,name')
                ->latest()
                ->take(5)
                ->get();

            return $this->success($fundraising);
        } catch (\Exception $e) {
            return $this->error('Fundraising campaign not found', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $fundraising = Fundraising::findOrFail($id);

            if ($user->id !== $fundraising->user_id) {
                return $this->error('Unauthorized', 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'full_description' => 'nullable|string',
                'category' => 'sometimes|string|in:education,health,preservation,community',
                'target_amount' => 'sometimes|numeric|min:1000',
                'end_date' => 'sometimes|date|after:today',
                'location' => 'nullable|string|max:255',
                'organizer_name' => 'sometimes|string|max:255',
                'organizer_email' => 'sometimes|email',
                'organizer_phone' => 'nullable|string',
                'featured_image_url' => 'nullable|url',
                'status' => 'sometimes|string|in:pending,active,completed,cancelled',
            ]);

            if ($validator->fails()) {
                return $this->error('Validation failed', 422, $validator->errors());
            }

            $data = $request->all();
            if (isset($data['title'])) {
                $data['slug'] = \Str::slug($data['title']);
            }

            $fundraising->update($data);

            return $this->success($fundraising, 'Fundraising campaign updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update fundraising campaign', 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            $fundraising = Fundraising::findOrFail($id);

            if ($user->id !== $fundraising->user_id) {
                return $this->error('Unauthorized', 403);
            }

            $fundraising->delete();

            return $this->success(null, 'Fundraising campaign deleted successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to delete fundraising campaign', 500);
        }
    }

    /**
     * Make a donation to a fundraising campaign.
     */
    public function donate(Request $request, $slug)
    {
        try {
            $user = Auth::user();
            if ($user->role === 'weaver') {
                return $this->error('Weavers cannot make donations', 403);
            }

            $fundraising = Fundraising::where('slug', $slug)->orWhere('id', $slug)->firstOrFail();

            if ($fundraising->status !== 'active') {
                return $this->error('This campaign is not accepting donations', 400);
            }

            if (now()->gt($fundraising->end_date)) {
                return $this->error('This campaign has ended', 400);
            }

            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|min:10',
                'message' => 'nullable|string|max:500',
                'is_anonymous' => 'boolean',
            ]);

            if ($validator->fails()) {
                return $this->error('Validation failed', 422, $validator->errors());
            }

            $donation = Donation::create([
                'user_id' => $user->id,
                'fundraising_id' => $fundraising->id,
                'amount' => $request->amount,
                'message' => $request->message,
                'is_anonymous' => $request->boolean('is_anonymous', false),
            ]);

            // Update fundraising status if target reached
            $currentAmount = $fundraising->donations()->sum('amount');
            if ($currentAmount >= $fundraising->target_amount) {
                $fundraising->update(['status' => 'completed']);
            }

            return $this->success($donation, 'Donation made successfully', 201);
        } catch (\Exception $e) {
            return $this->error('Failed to make donation', 500);
        }
    }

    /**
     * Get user's donations.
     */
    public function myDonations(Request $request)
    {
        try {
            $user = Auth::user();
            
            $donations = Donation::with('fundraising:id,title,slug')
                                ->where('user_id', $user->id)
                                ->latest()
                                ->paginate(10);

            return $this->success($donations);
        } catch (\Exception $e) {
            return $this->error('Failed to fetch donations', 500);
        }
    }

    /**
     * Get Cordillera-specific fundraisings.
     */
    public function cordillera()
    {
        try {
            $fundraisings = Fundraising::where('category', 'cordillera')
                                     ->orWhere('location', 'like', '%cordillera%')
                                     ->orWhere('title', 'like', '%cordillera%')
                                     ->with('user:id,name')
                                     ->latest()
                                     ->paginate(12);

            return $this->success($fundraisings);
        } catch (\Exception $e) {
            return $this->error('Failed to fetch Cordillera fundraisings', 500);
        }
    }
}