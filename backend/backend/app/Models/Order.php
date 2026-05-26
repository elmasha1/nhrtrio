<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'guest_email', 'status',
        'subtotal', 'shipping', 'tax', 'discount', 'total', 'currency', 'coupon_code',
        'shipping_address', 'billing_address',
        'tracking_number', 'carrier',
        'payment_intent_id', 'payment_method', 'payment_status',
        'customer_notes', 'admin_notes',
        'shipped_at', 'delivered_at',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'subtotal' => 'decimal:2',
        'shipping' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public static function generateOrderNumber(): string
    {
        return 'NHR-'.now()->format('Ymd').'-'.strtoupper(Str::random(6));
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(OrderEvent::class)->orderBy('occurred_at');
    }
}
