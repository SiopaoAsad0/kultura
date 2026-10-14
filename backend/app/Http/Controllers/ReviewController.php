<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    use ApiResponse;

    /**
     * Store a product review left by a customer after delivery.
     *
     * A customer may only review a product they actually purchased in an
     * order that has been delivered, and only once per order item.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return $this->error('Unauthenticated', 401);
        }

        // Weavers (sellers) cannot leave product reviews.
        if ($user->role === 'weaver') {
            return $this->error('Sellers cannot review products', 403);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'order_id'   => 'required|exists:orders,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        try {
            // The order must belong to the authenticated user...
            $order = Order::where('id', $request->input('order_id'))
                ->where('user_id', $user->id)
                ->first();

            if (!$order) {
                return $this->error('Order not found for this account', 404);
            }

            // ...and must be delivered before a review is allowed.
            if ($order->status !== Order::STATUS_DELIVERED) {
                return $this->error('You can only review products from a delivered order', 403);
            }

            // The product must be part of that order.
            $belongs = OrderItem::where('order_id', $order->id)
                ->where('product_id', $request->input('product_id'))
                ->exists();

            if (!$belongs) {
                return $this->error('This product is not part of the selected order', 404);
            }

            // Prevent duplicate reviews for the same order + product.
            $existing = Review::where('user_id', $user->id)
                ->where('order_id', $order->id)
                ->where('product_id', $request->input('product_id'))
                ->first();

            if ($existing) {
                return $this->error('You have already reviewed this product for this order', 409);
            }

            $review = Review::create([
                'user_id'    => $user->id,
                'product_id' => $request->input('product_id'),
                'order_id'   => $order->id,
                'rating'     => $request->input('rating'),
                'comment'    => $request->input('comment'),
            ]);

            return $this->success(
                $review->load(['user:id,name', 'product:id,title']),
                'Review submitted successfully',
                201
            );
        } catch (\Exception $e) {
            return $this->error('Failed to submit review: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Return all reviews for products owned by the authenticated weaver.
     */
    public function weaverReviews(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'weaver') {
            return $this->error('Only sellers can access this endpoint', 403);
        }

        try {
            // Product IDs belonging to this weaver.
            $productIds = Product::where('weaver_id', $user->id)->pluck('id');

            $reviews = Review::with([
                'user:id,name',
                'product:id,title,image_url',
            ])
            ->whereIn('product_id', $productIds)
            ->latest()
            ->paginate(15);

            $average = Review::whereIn('product_id', $productIds)->avg('rating');

            return $this->success([
                'average_rating' => round($average ?: 0, 2),
                'reviews'        => $reviews,
            ]);
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve reviews: ' . $e->getMessage(), 500);
        }
    }
}
