<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $q = Product::query()->where('status', 'active')->with(['category', 'images']);

        if ($s = $request->string('search')->toString()) {
            $q->where(function ($x) use ($s) {
                $x->where('name', 'like', "%$s%")
                  ->orWhere('short_description', 'like', "%$s%");
            });
        }
        if ($cat = $request->string('category')->toString()) {
            $q->whereHas('category', fn ($c) => $c->where('slug', $cat));
        }
        if ($request->filled('min_price')) $q->where('price', '>=', $request->float('min_price'));
        if ($request->filled('max_price')) $q->where('price', '<=', $request->float('max_price'));
        if ($g = $request->string('gender')->toString()) $q->where('gender', $g);
        if ($request->boolean('featured')) $q->where('is_featured', true);
        if ($request->boolean('on_sale')) $q->whereNotNull('compare_price')->whereColumn('compare_price', '>', 'price');

        $sort = $request->string('sort', 'newest')->toString();
        match ($sort) {
            'price_asc'  => $q->orderBy('price'),
            'price_desc' => $q->orderByDesc('price'),
            'rating'     => $q->orderByDesc('rating_avg')->orderByDesc('rating_count'),
            'popular'    => $q->orderByDesc('sold_count'),
            default      => $q->orderByDesc('id'),
        };

        return $q->paginate($request->integer('per_page', 12));
    }

    public function show(string $slug)
    {
        return Product::with(['category', 'images', 'reviews.user'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();
    }

    public function featured()
    {
        return Product::where('status', 'active')->where('is_featured', true)
            ->with('images')->take(8)->get();
    }

    public function newArrivals()
    {
        return Product::where('status', 'active')
            ->with('images')->orderByDesc('id')->take(8)->get();
    }

    public function related(string $slug)
    {
        $p = Product::where('slug', $slug)->firstOrFail();
        return Product::where('status', 'active')
            ->where('id', '!=', $p->id)
            ->where('category_id', $p->category_id)
            ->with('images')->take(4)->get();
    }
}
