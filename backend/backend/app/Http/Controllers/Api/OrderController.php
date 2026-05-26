<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return Order::where('user_id', $request->user()->id)
            ->with('items')->latest()->paginate(10);
    }

    public function show(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id || $request->user()->isAdmin(), 403);
        return $order->load(['items', 'events']);
    }

    public function track(string $orderNumber)
    {
        $order = Order::with(['items', 'events'])
            ->where('order_number', $orderNumber)->firstOrFail();
        return response()->json([
            'order_number'    => $order->order_number,
            'status'          => $order->status,
            'tracking_number' => $order->tracking_number,
            'carrier'         => $order->carrier,
            'shipped_at'      => $order->shipped_at,
            'delivered_at'    => $order->delivered_at,
            'events'          => $order->events,
            'items'           => $order->items,
            'total'           => $order->total,
        ]);
    }

    public function cancel(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        if (! in_array($order->status, ['pending', 'paid', 'processing'])) {
            return response()->json(['message' => 'Cannot cancel this order'], 422);
        }
        $order->update(['status' => 'cancelled']);
        $order->events()->create([
            'status' => 'cancelled', 'description' => 'Cancelled by customer', 'occurred_at' => now(),
        ]);
        return response()->json(['order' => $order->fresh('events')]);
    }
}
