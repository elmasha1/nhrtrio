<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validateCode(Request $request)
    {
        $data = $request->validate([
            'code'     => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', $data['code'])->first();
        if (! $coupon || ! $coupon->isValid((float) $data['subtotal'])) {
            return response()->json(['valid' => false, 'message' => 'Invalid or expired code'], 422);
        }

        return response()->json([
            'valid'    => true,
            'code'     => $coupon->code,
            'type'     => $coupon->type,
            'value'    => $coupon->value,
            'discount' => $coupon->discountFor((float) $data['subtotal']),
        ]);
    }
}
