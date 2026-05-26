<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'name', 'slug', 'sku', 'short_description', 'description',
        'price', 'compare_price', 'stock', 'sizes', 'colors', 'material',
        'gender', 'is_featured', 'status',
    ];

    protected $casts = [
        'sizes' => 'array',
        'colors' => 'array',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'rating_avg' => 'decimal:2',
    ];

    protected $appends = ['primary_image'];

    protected static function booted(): void
    {
        static::saving(function (Product $p) {
            if (empty($p->slug)) {
                $p->slug = Str::slug($p->name).'-'.Str::lower(Str::random(5));
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('status', 'approved');
    }

    public function getPrimaryImageAttribute(): ?string
    {
        return $this->images()->first()?->url;
    }

    public function recalculateRating(): void
    {
        $stats = $this->reviews()->selectRaw('AVG(rating) as avg, COUNT(*) as cnt')->first();
        $this->update([
            'rating_avg' => round($stats->avg ?? 0, 2),
            'rating_count' => $stats->cnt ?? 0,
        ]);
    }
}
