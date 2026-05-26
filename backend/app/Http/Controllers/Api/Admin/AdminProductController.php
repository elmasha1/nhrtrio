<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $q = Product::query()->with(['category', 'images']);
        if ($s = $request->string('search')->toString()) {
            $q->where('name', 'like', "%$s%");
        }
        return $q->latest()->paginate(20);
    }

    public function show(Product $product)
    {
        return $product->load(['category', 'images']);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $images = $data['images'] ?? [];
        unset($data['images']);

        $product = Product::create($data);
        foreach ($images as $i => $url) {
            $product->images()->create(['url' => $url, 'sort_order' => $i]);
        }
        return response()->json($product->load('images'), 201);
    }

    public function update(Request $request, Product $product)
    {
        $data = $this->validated($request, $product->id);
        $images = $data['images'] ?? null;
        unset($data['images']);

        $product->update($data);
        if (is_array($images)) {
            $product->images()->delete();
            foreach ($images as $i => $url) {
                $product->images()->create(['url' => $url, 'sort_order' => $i]);
            }
        }
        return response()->json($product->fresh('images'));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }

    protected function validated(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'category_id'       => 'nullable|exists:categories,id',
            'name'              => 'required|string|max:255',
            'sku'               => 'nullable|string|max:120',
            'short_description' => 'nullable|string|max:500',
            'description'       => 'nullable|string',
            'price'             => 'required|numeric|min:0',
            'compare_price'     => 'nullable|numeric|min:0',
            'stock'             => 'required|integer|min:0',
            'sizes'             => 'nullable|array',
            'colors'            => 'nullable|array',
            'material'          => 'nullable|string|max:120',
            'gender'            => 'nullable|in:men,women,unisex,kids',
            'is_featured'       => 'sometimes|boolean',
            'status'            => 'required|in:draft,active,archived',
            'images'            => 'nullable|array',
            'images.*'          => 'string',
        ]);
    }
}
