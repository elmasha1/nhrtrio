<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    public function index()
    {
        return Category::orderBy('sort_order')->withCount('products')->get();
    }

    public function store(Request $request)
    {
        return Category::create($this->validated($request));
    }

    public function update(Request $request, Category $category)
    {
        $category->update($this->validated($request));
        return $category;
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(['message' => 'Deleted']);
    }

    protected function validated(Request $request): array
    {
        return $request->validate([
            'name'        => 'required|string|max:120',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
            'is_active'   => 'sometimes|boolean',
            'sort_order'  => 'nullable|integer',
        ]);
    }
}
