<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(string $slug)
    {
        $p = Product::where('slug', $slug)->firstOrFail();
        return $p->reviews()->with('user:id,name,avatar')->latest()->paginate(10);
    }

    public function store(Request $request, string $slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        $data = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title'  => 'nullable|string|max:120',
            'body'   => 'nullable|string|max:3000',
        ]);

        $userId = $request->user()->id;

        $verified = Order::where('user_id', $userId)
            ->whereIn('status', ['paid', 'processing', 'shipped', 'delivered'])
            ->whereHas('items', fn ($q) => $q->where('product_id', $product->id))
            ->exists();

        $review = Review::updateOrCreate(
            ['user_id' => $userId, 'product_id' => $product->id],
            $data + ['is_verified_purchase' => $verified, 'status' => 'approved']
        );

        $product->recalculateRating();

        return response()->json($review->load('user:id,name,avatar'), 201);
    }

    public function destroy(Request $request, Review $review)
    {
        abort_unless($review->user_id === $request->user()->id || $request->user()->isAdmin(), 403);
        $productId = $review->product_id;
        $review->delete();
        Product::find($productId)?->recalculateRating();
        return response()->json(['message' => 'Deleted']);
    }
}
