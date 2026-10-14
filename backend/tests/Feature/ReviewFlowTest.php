<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReviewFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
    }

    public function test_customer_review_requires_delivered_order(): void
    {
        Sanctum::actingAs(User::where('role', 'user')->first());

        $customer = User::where('role', 'user')->first();
        $product = Product::first();
        $order = Order::create([
            'user_id'          => $customer->id,
            'subtotal'         => 100,
            'tax'              => 12,
            'total'            => 112,
            'status'           => 'processing',
            'payment_status'   => 'unpaid',
            'payment_method'   => 'cash_on_delivery',
            'shipping_address' => '123 Test St',
            'delivery_status'  => 'assigned',
        ]);
        $order->items()->create([
            'product_id'   => $product->id,
            'product_name' => $product->title,
            'quantity'     => 1,
            'price'        => 100,
            'total'        => 100,
        ]);

        // Not delivered yet -> rejected (403)
        $this->postJson('/api/reviews', [
            'product_id' => $product->id,
            'order_id'   => $order->id,
            'rating'     => 5,
            'comment'    => 'Great!',
        ])->assertStatus(403);

        // Mark delivered, then review should succeed
        $order->update(['status' => 'delivered', 'delivery_status' => 'delivered']);
        $this->postJson('/api/reviews', [
            'product_id' => $product->id,
            'order_id'   => $order->id,
            'rating'     => 5,
            'comment'    => 'Great!',
        ])->assertStatus(201);

        // Duplicate review rejected (409)
        $this->postJson('/api/reviews', [
            'product_id' => $product->id,
            'order_id'   => $order->id,
            'rating'     => 4,
            'comment'    => 'Again',
        ])->assertStatus(409);
    }

    public function test_weaver_cannot_review_products(): void
    {
        Sanctum::actingAs(User::where('role', 'weaver')->first());
        $this->postJson('/api/reviews', [
            'product_id' => Product::first()->id,
            'order_id'   => 1,
            'rating'     => 5,
        ])->assertStatus(403);
    }
}
