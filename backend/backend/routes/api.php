<?php

use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminChatController;
use App\Http\Controllers\Api\Admin\AdminCouponController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminReviewController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Public storefront
    Route::get('/health', fn () => ['ok' => true, 'time' => now()->toIso8601String()]);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/new-arrivals', [ProductController::class, 'newArrivals']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/products/{slug}/related', [ProductController::class, 'related']);
    Route::get('/products/{slug}/reviews', [ReviewController::class, 'index']);

    Route::post('/checkout/quote', [CheckoutController::class, 'quote']);
    Route::post('/coupons/validate', [CouponController::class, 'validateCode']);

    Route::get('/track/{orderNumber}', [OrderController::class, 'track']);

    Route::post('/chat/guest', [ChatController::class, 'guestStart']);

    // Auth
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login',    [AuthController::class, 'login']);

    // Authenticated
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::patch('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/password', [AuthController::class, 'changePassword']);

        Route::apiResource('addresses', AddressController::class)->except(['show']);

        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);

        Route::post('/products/{slug}/reviews', [ReviewController::class, 'store']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        Route::post('/checkout/place', [CheckoutController::class, 'placeOrder']);
        Route::post('/orders/{order}/confirm-payment', [CheckoutController::class, 'confirmPayment']);

        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);

        Route::get('/chat/me', [ChatController::class, 'myConversation']);
        Route::get('/chat/poll', [ChatController::class, 'poll']);
        Route::post('/chat/send', [ChatController::class, 'send']);

        // Admin
        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);

            Route::apiResource('products', AdminProductController::class);
            Route::apiResource('categories', AdminCategoryController::class)->except(['show']);
            Route::apiResource('coupons', AdminCouponController::class)->except(['show']);

            Route::get('/orders', [AdminOrderController::class, 'index']);
            Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
            Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);

            Route::get('/users', [AdminUserController::class, 'index']);
            Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole']);

            Route::get('/reviews', [AdminReviewController::class, 'index']);
            Route::patch('/reviews/{review}/status', [AdminReviewController::class, 'updateStatus']);
            Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);

            Route::get('/conversations', [AdminChatController::class, 'index']);
            Route::get('/conversations/{conversation}', [AdminChatController::class, 'show']);
            Route::post('/conversations/{conversation}/reply', [AdminChatController::class, 'reply']);
            Route::patch('/conversations/{conversation}/close', [AdminChatController::class, 'close']);
        });
    });
});
