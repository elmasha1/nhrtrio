<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $q = Order::query()->with('user:id,name,email');
        if ($s = $request->string('status')->toString()) $q->where('status', $s);
        if ($s = $request->string('search')->toString()) {
            $q->where(function ($x) use ($s) {
                $x->where('order_number', 'like', "%$s%")
                  ->orWhere('guest_email', 'like', "%$s%")
                  ->orWhereHas('user', fn ($u) => $u->where('email', 'like', "%$s%"));
            });
        }
        return $q->latest()->paginate(20);
    }

    public function show(Order $order)
    {
        return $order->load(['items', 'events', 'user']);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status'          => 'required|in:pending,paid,processing,shipped,out_for_delivery,delivered,cancelled,refunded',
            'tracking_number' => 'nullable|string|max:120',
            'carrier'         => 'nullable|string|max:80',
            'location'        => 'nullable|string|max:120',
            'description'     => 'nullable|string|max:500',
        ]);

        $update = ['status' => $data['status']];
        if (! empty($data['tracking_number'])) $update['tracking_number'] = $data['tracking_number'];
        if (! empty($data['carrier'])) $update['carrier'] = $data['carrier'];
        if ($data['status'] === 'shipped' && ! $order->shipped_at) $update['shipped_at'] = now();
        if ($data['status'] === 'delivered' && ! $order->delivered_at) $update['delivered_at'] = now();

        $order->update($update);

        $order->events()->create([
            'status'      => $data['status'],
            'location'    => $data['location'] ?? null,
            'description' => $data['description'] ?? 'Status updated by admin',
            'occurred_at' => now(),
        ]);

        return $order->fresh(['items', 'events']);
    }
}
