<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
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

    // Admin-only routes
    Route::middleware('role:admin')->group(function() {
        // Cultural Categories management
        Route::post('/cultural-categories', [CulturalCategoryController::class, 'store']);
        Route::put('/cultural-categories/{culturalCategory}', [CulturalCategoryController::class, 'update']);
        Route::delete('/cultural-categories/{culturalCategory}', [CulturalCategoryController::class, 'destroy']);

        // Product management (weaver only)
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    });
    
    // Cart routes
    Route::prefix('cart')->group(function() {
        Route::post('/add', [CartController::class, 'addToCart']);
        Route::get('/', [CartController::class, 'viewCart']);
        Route::delete('/{id}', [CartController::class, 'removeFromCart']);
        Route::post('/checkout', [CartController::class, 'checkout']);
    });
    
    // Order routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
});

// Public routes for stories, fundraising, and imagery
Route::get('/stories', [App\Http\Controllers\StoryController::class, 'index']);
Route::get('/stories/featured', [App\Http\Controllers\StoryController::class, 'featured']);
Route::get('/stories/cordillera', [App\Http\Controllers\StoryController::class, 'cordillera']);
Route::get('/stories/{story}', [App\Http\Controllers\StoryController::class, 'show']);
Route::post('/stories/{story}/like', [App\Http\Controllers\StoryController::class, 'like']);

Route::get('/fundraisings', [App\Http\Controllers\FundraisingController::class, 'index']);
Route::get('/fundraisings/featured', [App\Http\Controllers\FundraisingController::class, 'featured']);
Route::get('/fundraisings/cordillera', [App\Http\Controllers\FundraisingController::class, 'cordillera']);
Route::get('/fundraisings/{fundraising}', [App\Http\Controllers\FundraisingController::class, 'show']);

Route::get('/imageries', [App\Http\Controllers\ImageryController::class, 'index']);
Route::get('/imageries/featured', [App\Http\Controllers\ImageryController::class, 'featured']);
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
    
    // Imagery management
    Route::post('/imageries', [App\Http\Controllers\ImageryController::class, 'store']);
    Route::put('/imageries/{imagery}', [App\Http\Controllers\ImageryController::class, 'update']);
    Route::delete('/imageries/{imagery}', [App\Http\Controllers\ImageryController::class, 'destroy']);
});
