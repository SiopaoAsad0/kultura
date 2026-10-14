<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PageView;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    use ApiResponse;

    /**
     * Ensure the authenticated user is an administrator.
     */
    protected function ensureAdmin(): ?User
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            return null;
        }

        return $user;
    }

    /**
     * List users with related counts, optionally filtered by role.
     */
    public function users(Request $request)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        try {
            $query = User::query()
                ->withCount(['orders', 'products', 'reviews']);

            if ($role = $request->input('role')) {
                $query->where('role', $role);
            }

            $users = $query->orderBy('created_at', 'desc')->paginate(20);

            return $this->success($users);
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve users: ' . $e->getMessage(), 500);
        }
    }

    /**
     * List all product reviews for moderation.
     */
    public function reviews(Request $request)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        try {
            $reviews = Review::with([
                'user:id,name',
                'product:id,title,image_url',
            ])
            ->latest()
            ->paginate(20);

            return $this->success($reviews);
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve reviews: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Aggregate dashboard statistics for the admin overview.
     */
    public function stats(Request $request)
    {
        if (!$this->ensureAdmin()) {
            return $this->error('Unauthorized. Admin access required.', 403);
        }

        try {
            $weekStart = now()->subDays(7);

            // Most visited pages in the last 7 days.
            $topPages = PageView::query()
                ->where('created_at', '>=', $weekStart)
                ->select('path', DB::raw('COUNT(*) as views'))
                ->groupBy('path')
                ->orderByDesc('views')
                ->limit(5)
                ->get();

            $stats = [
                'users' => [
                    'customers' => User::where('role', 'user')->count(),
                    'sellers'   => User::where('role', 'weaver')->count(),
                    'admins'    => User::where('role', 'admin')->count(),
                    'total'     => User::count(),
                ],
                'activity' => [
                    'views_week'        => PageView::where('created_at', '>=', $weekStart)->count(),
                    'views_total'       => PageView::count(),
                    'active_users_week' => PageView::where('created_at', '>=', $weekStart)
                        ->whereNotNull('user_id')
                        ->distinct('user_id')
                        ->count('user_id'),
                    'top_pages'         => $topPages,
                ],
                'catalog' => [
                    'orders'    => Order::count(),
                    'delivered' => Order::where('status', Order::STATUS_DELIVERED)->count(),
                    'products'  => Product::count(),
                    'revenue'   => (float) Order::where('status', Order::STATUS_DELIVERED)->sum('total'),
                ],
                'reviews' => [
                    'count'   => Review::count(),
                    'average' => round((float) Review::avg('rating'), 2),
                ],
            ];

            return $this->success($stats);
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve stats: ' . $e->getMessage(), 500);
        }
    }
}
