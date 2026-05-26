<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::where('is_active', true)
            ->orderBy('sort_order')
            ->withCount(['products' => fn ($q) => $q->where('status', 'active')])
            ->get();
    }

    public function show(string $slug)
    {
        return Category::where('slug', $slug)->where('is_active', true)->firstOrFail();
    }
}
