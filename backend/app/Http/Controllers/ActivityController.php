<?php

namespace App\Http\Controllers;

use App\Models\PageView;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityController extends Controller
{
    use ApiResponse;

    /**
     * Record a page view for analytics.
     *
     * This endpoint is intentionally "best effort": tracking must never
     * break the user's browsing experience, so any failure is swallowed
     * and a success response is always returned to the frontend.
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            PageView::create([
                'user_id'    => $user?->id,
                'path'       => $request->input('path', $request->path()),
                'page'       => $request->input('page'),
                'role'       => $user?->role,
                'device'     => $request->input('device'),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);

            return $this->success(null, 'Activity recorded');
        } catch (\Exception $e) {
            // Never surface tracking errors to the client.
            return $this->success(null, 'Activity recorded');
        }
    }
}
