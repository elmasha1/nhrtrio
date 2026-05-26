<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class AdminCouponController extends Controller
{
    public function index()
    {
        return Coupon::latest()->paginate(20);
    }

    public function store(Request $request)
    {
        return Coupon::create($this->validated($request));
    }

    public function update(Request $request, Coupon $coupon)
    {
        $coupon->update($this->validated($request, $coupon->id));
        return $coupon;
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return response()->json(['message' => 'Deleted']);
    }

    protected function validated(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'code'        => 'required|string|max:60|unique:coupons,code,'.($id ?? 'NULL'),
            'type'        => 'required|in:percent,fixed',
            'value'       => 'required|numeric|min:0',
            'min_total'   => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'starts_at'   => 'nullable|date',
            'expires_at'  => 'nullable|date|after:starts_at',
            'is_active'   => 'sometimes|boolean',
        ]);
    }
}
