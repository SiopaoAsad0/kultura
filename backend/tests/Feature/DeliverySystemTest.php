<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Rider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DeliverySystemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
    }

    protected function admin(): User
    {
        return User::where('role', 'admin')->first();
    }

    public function test_admin_can_manage_riders(): void
    {
        Sanctum::actingAs($this->admin());

        // Seeded riders exist
        $this->getJson('/api/admin/riders')->assertOk();
        $this->assertGreaterThan(0, Rider::count());

        // Create a rider
        $res = $this->postJson('/api/admin/riders', [
            'name'         => 'Test Rider',
            'phone'        => '0900-000-0000',
            'vehicle_type' => 'van',
            'plate_number' => 'TEST 1',
        ]);
        $res->assertStatus(201)->assertJson(['success' => true]);
        $riderId = $res->json('data.id');
        $this->assertDatabaseHas('riders', ['phone' => '0900-000-0000']);

        // Update a rider
        $this->putJson("/api/admin/riders/{$riderId}", ['status' => 'offline'])->assertOk();
        $this->assertDatabaseHas('riders', ['id' => $riderId, 'status' => 'offline']);

        // Delete a rider
        $this->deleteJson("/api/admin/riders/{$riderId}")->assertOk();
        $this->assertDatabaseMissing('riders', ['id' => $riderId]);
    }

    public function test_non_admin_cannot_manage_riders(): void
    {
        Sanctum::actingAs(User::where('role', 'user')->first());
        $this->getJson('/api/admin/riders')->assertStatus(403);
        $this->postJson('/api/admin/riders', [])->assertStatus(403);
    }

    public function test_delivery_lifecycle_assignment_and_status(): void
    {
        Sanctum::actingAs($this->admin());

        $customer = User::where('role', 'user')->first();
        $order = Order::create([
            'user_id'          => $customer->id,
            'subtotal'         => 100,
            'tax'              => 12,
            'total'            => 112,
            'status'           => 'processing',
            'payment_status'   => 'unpaid',
            'payment_method'   => 'cash_on_delivery',
            'shipping_address' => '123 Test St',
            'delivery_status'  => 'unassigned',
        ]);

        $rider = Rider::first();

        $this->postJson("/api/admin/orders/{$order->id}/assign-rider", ['rider_id' => $rider->id])->assertOk();
        $order->refresh();
        $this->assertEquals('assigned', $order->delivery_status);
        $this->assertEquals($rider->id, $order->rider_id);
        $this->assertEquals('on_delivery', $rider->fresh()->status);

        $this->postJson("/api/admin/orders/{$order->id}/delivery-status", ['delivery_status' => 'picked_up'])->assertOk();
        $this->postJson("/api/admin/orders/{$order->id}/delivery-status", ['delivery_status' => 'in_transit'])->assertOk();

        $this->postJson("/api/admin/orders/{$order->id}/delivery-status", ['delivery_status' => 'delivered'])->assertOk();
        $order->refresh();
        $this->assertEquals('delivered', $order->delivery_status);
        $this->assertEquals('delivered', $order->status);
        $this->assertEquals('paid', $order->payment_status);
        $this->assertNotNull($order->delivered_at);
        $this->assertEquals('available', $rider->fresh()->status);
    }

    public function test_orders_list_and_search(): void
    {
        Sanctum::actingAs($this->admin());
        $this->getJson('/api/admin/orders')->assertOk()->assertJson(['success' => true]);
        $this->getJson('/api/admin/orders', ['delivery_status' => 'delivered'])->assertOk();
    }

    public function test_payments_and_reports(): void
    {
        Sanctum::actingAs($this->admin());
        $this->getJson('/api/admin/payments')->assertOk();
        $this->getJson('/api/admin/reports')->assertOk()->assertJsonStructure([
            'data' => ['revenue', 'total_orders', 'delivered', 'pending', 'cancelled', 'by_status', 'by_delivery', 'by_payment', 'top_products'],
        ]);
    }
}
