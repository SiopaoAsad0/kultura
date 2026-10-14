<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\Api\CulturalCategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public product routes
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
Route::post('/activity/view', [ActivityController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function() {
    // User routes
    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
            'permissions' => $request->user()->getAllPermissions()->pluck('name')
        ]);
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Cultural Categories (public read, admin write)
    Route::get('/cultural-categories', [CulturalCategoryController::class, 'index']);
    Route::get('/cultural-categories/{culturalCategory}', [CulturalCategoryController::class, 'show']);

    // Weaver-only routes for product management
    Route::middleware('role:weaver')->group(function() {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        
        // Weaver order management
        Route::get('/weaver/orders', [OrderController::class, 'weaverOrders']);
        Route::post('/weaver/orders/{id}/confirm', [OrderController::class, 'confirmOrder']);
        Route::get('/weaver/reviews', [ReviewController::class, 'weaverReviews']);
    });

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/reviews', [AdminController::class, 'reviews']);
        Route::get('/stats', [AdminController::class, 'stats']);

        // Order / Delivery Management System (local simulation)
        Route::get('/orders', [DeliveryController::class, 'orders']);
        Route::post('/orders/{id}/assign-rider', [DeliveryController::class, 'assignRider']);
        Route::post('/orders/{id}/delivery-status', [DeliveryController::class, 'updateDeliveryStatus']);

        // Rider management
        Route::get('/riders', [DeliveryController::class, 'riders']);
        Route::post('/riders', [DeliveryController::class, 'storeRider']);
        Route::put('/riders/{id}', [DeliveryController::class, 'updateRider']);
        Route::delete('/riders/{id}', [DeliveryController::class, 'destroyRider']);

        // Payments / transactions
        Route::get('/payments', [DeliveryController::class, 'payments']);
        Route::post('/payments/{id}/status', [DeliveryController::class, 'updatePaymentStatus']);

        // Reports
        Route::get('/reports', [DeliveryController::class, 'reports']);
    });

    Route::post('/reviews', [ReviewController::class, 'store']);
    
    // Cart routes
    Route::prefix('cart')->group(function() {
        Route::post('/add', [CartController::class, 'addToCart']);
        Route::get('/', [CartController::class, 'viewCart']);
        Route::delete('/{id}', [CartController::class, 'removeFromCart']);
        Route::post('/checkout', [CartController::class, 'checkout']);
    });
    
    // Order routes
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
});

// Public routes for stories, fundraising, and imagery
Route::get('/stories', [App\Http\Controllers\StoryController::class, 'index']);
Route::get('/stories/cordillera', [App\Http\Controllers\StoryController::class, 'cordillera']);
Route::get('/stories/{story}', [App\Http\Controllers\StoryController::class, 'show']);
Route::post('/stories/{story}/like', [App\Http\Controllers\StoryController::class, 'like']);

Route::get('/fundraisings', [App\Http\Controllers\FundraisingController::class, 'index']);
Route::get('/fundraisings/cordillera', [App\Http\Controllers\FundraisingController::class, 'cordillera']);
Route::get('/fundraisings/{fundraising}', [App\Http\Controllers\FundraisingController::class, 'show']);

Route::get('/imageries', [App\Http\Controllers\ImageryController::class, 'index']);
Route::get('/imageries/cordillera', [App\Http\Controllers\ImageryController::class, 'cordillera']);
Route::get('/imageries/{imagery}', [App\Http\Controllers\ImageryController::class, 'show']);

// Protected routes for content creation
Route::middleware('auth:sanctum')->group(function() {
    // Story management
    Route::post('/stories', [App\Http\Controllers\StoryController::class, 'store']);
    Route::put('/stories/{story}', [App\Http\Controllers\StoryController::class, 'update']);
    Route::delete('/stories/{story}', [App\Http\Controllers\StoryController::class, 'destroy']);
    
    // Fundraising management
    Route::post('/fundraisings', [App\Http\Controllers\FundraisingController::class, 'store']);
    Route::put('/fundraisings/{fundraising}', [App\Http\Controllers\FundraisingController::class, 'update']);
    Route::delete('/fundraisings/{fundraising}', [App\Http\Controllers\FundraisingController::class, 'destroy']);
    
    // Fundraising donations
    Route::post('/fundraisings/{fundraising}/donate', [App\Http\Controllers\FundraisingController::class, 'donate']);
    Route::get('/my-donations', [App\Http\Controllers\FundraisingController::class, 'myDonations']);
    
    // Imagery management
    Route::post('/imageries', [App\Http\Controllers\ImageryController::class, 'store']);
    Route::put('/imageries/{imagery}', [App\Http\Controllers\ImageryController::class, 'update']);
    Route::delete('/imageries/{imagery}', [App\Http\Controllers\ImageryController::class, 'destroy']);
});
