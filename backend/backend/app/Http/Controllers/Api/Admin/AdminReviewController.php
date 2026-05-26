<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    public function index(Request $request)
    {
        $q = Review::with(['user:id,name,email', 'product:id,name,slug']);
        if ($s = $request->string('status')->toString()) $q->where('status', $s);
        return $q->latest()->paginate(20);
    }

    public function updateStatus(Request $request, Review $review)
    {
        $data = $request->validate(['status' => 'required|in:pending,approved,rejected']);
        $review->update($data);
        Product::find($review->product_id)?->recalculateRating();
        return $review;
    }

    public function destroy(Review $review)
    {
        $pid = $review->product_id;
        $review->delete();
        Product::find($pid)?->recalculateRating();
        return response()->json(['message' => 'Deleted']);
    }
}
