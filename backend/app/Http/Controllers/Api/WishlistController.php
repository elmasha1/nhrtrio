<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        return Wishlist::where('user_id', $request->user()->id)
            ->with(['product.images', 'product.category'])
            ->latest()->get();
    }

    public function toggle(Request $request)
    {
        $data = $request->validate(['product_id' => 'required|exists:products,id']);
        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $data['product_id'])->first();
        if ($existing) {
            $existing->delete();
            return response()->json(['in_wishlist' => false]);
        }
        Wishlist::create(['user_id' => $request->user()->id, 'product_id' => $data['product_id']]);
        return response()->json(['in_wishlist' => true]);
    }
}
