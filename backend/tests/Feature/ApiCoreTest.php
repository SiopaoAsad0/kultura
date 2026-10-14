<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\Rider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiCoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
    }

    /** Public content endpoints must never 500. */
    public function test_public_endpoints_return_success(): void
    {
        foreach (['/api/products', '/api/fundraisings', '/api/stories', '/api/imageries'] as $uri) {
            $this->getJson($uri)->assertOk()->assertJson(['success' => true]);
        }
    }

    /** The activity tracker endpoint must always succeed. */
    public function test_activity_view_is_recorded(): void
    {
        $this->postJson('/api/activity/view', [
            'path'   => '/test',
            'page'   => 'Test',
            'device' => 'desktop',
        ])->assertOk()->assertJson(['success' => true]);

        $this->assertDatabaseHas('page_views', ['path' => '/test']);
    }

    public function test_login_with_seeded_admin_works(): void
    {
        $res = $this->postJson('/api/login', [
            'email'    => 'admin@kultura.com',
            'password' => 'password',
        ]);

        $res->assertOk();
        $this->assertNotEmpty($res->json('token'));
        $this->assertEquals('admin', $res->json('user.role'));
    }

    public function test_seeder_creates_one_admin(): void
    {
        $this->assertEquals(1, User::where('role', 'admin')->count());
        $this->assertTrue(User::where('email', 'admin@kultura.com')->exists());
    }

    public function test_admin_endpoints_require_auth(): void
    {
        $this->getJson('/api/admin/stats')->assertStatus(401);
    }

    public function test_admin_can_access_admin_endpoints(): void
    {
        Sanctum::actingAs(User::where('role', 'admin')->first());

        $this->getJson('/api/admin/stats')->assertOk()->assertJsonStructure([
            'data' => ['users', 'activity', 'catalog', 'reviews'],
        ]);
        $this->getJson('/api/admin/users')->assertOk();
        $this->getJson('/api/admin/reviews')->assertOk();
    }

    public function test_non_admin_cannot_access_admin_endpoints(): void
    {
        Sanctum::actingAs(User::where('role', 'weaver')->first());
        $this->getJson('/api/admin/stats')->assertStatus(403);
    }

    public function test_weaver_can_access_weaver_endpoints(): void
    {
        Sanctum::actingAs(User::where('role', 'weaver')->first());
        $this->getJson('/api/weaver/orders')->assertOk();
        $this->getJson('/api/weaver/reviews')->assertOk();
    }

    public function test_customer_cannot_access_weaver_endpoints(): void
    {
        Sanctum::actingAs(User::where('role', 'user')->first());
        $this->getJson('/api/weaver/orders')->assertStatus(403);
    }
}
