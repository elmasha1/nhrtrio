<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderEvent;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\StripeClient;

class CheckoutController extends Controller
{
    public function quote(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1|max:50',
            'items.*.size'       => 'nullable|string',
            'items.*.color'      => 'nullable|string',
            'coupon_code'        => 'nullable|string',
            'country'            => 'nullable|string|size:2',
        ]);

        return response()->json($this->calculateTotals($data));
    }

    public function placeOrder(Request $request)
    {
        $data = $request->validate([
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1|max:50',
            'items.*.size'       => 'nullable|string',
            'items.*.color'      => 'nullable|string',
            'shipping_address'   => 'required|array',
            'billing_address'    => 'nullable|array',
            'coupon_code'        => 'nullable|string',
            'customer_notes'     => 'nullable|string|max:500',
            'guest_email'        => 'nullable|email',
        ]);

        $totals = $this->calculateTotals($data);

        $order = DB::transaction(function () use ($request, $data, $totals) {
            $order = Order::create([
                'order_number'     => Order::generateOrderNumber(),
                'user_id'          => $request->user()?->id,
                'guest_email'      => $data['guest_email'] ?? null,
                'status'           => 'pending',
                'subtotal'         => $totals['subtotal'],
                'shipping'         => $totals['shipping'],
                'tax'              => $totals['tax'],
                'discount'         => $totals['discount'],
                'total'            => $totals['total'],
                'currency'         => 'USD',
                'coupon_code'      => $data['coupon_code'] ?? null,
                'shipping_address' => $data['shipping_address'],
                'billing_address'  => $data['billing_address'] ?? $data['shipping_address'],
                'customer_notes'   => $data['customer_notes'] ?? null,
                'payment_status'   => 'pending',
            ]);

            foreach ($totals['lines'] as $line) {
                $order->items()->create($line);
            }

            $order->events()->create([
                'status' => 'pending',
                'description' => 'Order created — awaiting payment',
                'occurred_at' => now(),
            ]);

            return $order;
        });

        $clientSecret = $this->createStripePaymentIntent($order);

        return response()->json([
            'order'         => $order->fresh('items'),
            'client_secret' => $clientSecret,
            'publishable_key' => config('services.stripe.key'),
        ], 201);
    }

    public function confirmPayment(Request $request, Order $order)
    {
        $data = $request->validate(['payment_intent_id' => 'required|string']);

        if (config('services.stripe.secret') && ! str_starts_with(config('services.stripe.secret'), 'sk_test_replace')) {
            $stripe = new StripeClient(config('services.stripe.secret'));
            $pi = $stripe->paymentIntents->retrieve($data['payment_intent_id']);
            if ($pi->status !== 'succeeded') {
                return response()->json(['message' => 'Payment not completed'], 422);
            }
        }

        $order->update([
            'status'            => 'paid',
            'payment_status'    => 'paid',
            'payment_intent_id' => $data['payment_intent_id'],
            'payment_method'    => 'stripe',
        ]);

        OrderEvent::create([
            'order_id'    => $order->id,
            'status'      => 'paid',
            'description' => 'Payment received',
            'occurred_at' => now(),
        ]);

        foreach ($order->items as $item) {
            if ($item->product_id) {
                Product::where('id', $item->product_id)->decrement('stock', $item->quantity);
                Product::where('id', $item->product_id)->increment('sold_count', $item->quantity);
            }
        }

        return response()->json(['order' => $order->fresh(['items', 'events'])]);
    }

    protected function calculateTotals(array $data): array
    {
        $lines = [];
        $subtotal = 0;

        $ids = array_column($data['items'], 'product_id');
        $products = Product::whereIn('id', $ids)->get()->keyBy('id');

        foreach ($data['items'] as $item) {
            $p = $products[$item['product_id']] ?? null;
            if (! $p) continue;
            $qty = (int) $item['quantity'];
            $price = (float) $p->price;
            $lineTotal = round($price * $qty, 2);
            $subtotal += $lineTotal;
            $lines[] = [
                'product_id'    => $p->id,
                'product_name'  => $p->name,
                'product_image' => $p->primary_image,
                'price'         => $price,
                'quantity'      => $qty,
                'size'          => $item['size'] ?? null,
                'color'         => $item['color'] ?? null,
                'subtotal'      => $lineTotal,
            ];
        }

        $discount = 0;
        if (! empty($data['coupon_code'])) {
            $coupon = Coupon::where('code', $data['coupon_code'])->first();
            if ($coupon && $coupon->isValid($subtotal)) {
                $discount = $coupon->discountFor($subtotal);
            }
        }

        $taxableBase = max(0, $subtotal - $discount);
        $tax = round($taxableBase * 0.08, 2);
        $shipping = $taxableBase >= 100 ? 0 : ($taxableBase > 0 ? 9.99 : 0);
        $total = round($taxableBase + $tax + $shipping, 2);

        return compact('lines', 'subtotal', 'discount', 'tax', 'shipping', 'total');
    }

    protected function createStripePaymentIntent(Order $order): ?string
    {
        $secret = config('services.stripe.secret');
        if (! $secret || str_starts_with($secret, 'sk_test_replace')) {
            return 'pi_mock_'.$order->id.'_secret_dev';
        }
        $stripe = new StripeClient($secret);
        $pi = $stripe->paymentIntents->create([
            'amount'   => (int) round($order->total * 100),
            'currency' => strtolower($order->currency),
            'metadata' => ['order_id' => $order->id, 'order_number' => $order->order_number],
        ]);
        $order->update(['payment_intent_id' => $pi->id]);
        return $pi->client_secret;
    }
}
