<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return Address::where('user_id', $request->user()->id)->orderByDesc('is_default')->get();
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        if (! empty($data['is_default'])) {
            Address::where('user_id', $request->user()->id)->update(['is_default' => false]);
        }
        $address = $request->user()->addresses()->create($data);
        return response()->json($address, 201);
    }

    public function update(Request $request, Address $address)
    {
        abort_unless($address->user_id === $request->user()->id, 403);
        $data = $this->validated($request);
        if (! empty($data['is_default'])) {
            Address::where('user_id', $request->user()->id)->update(['is_default' => false]);
        }
        $address->update($data);
        return response()->json($address);
    }

    public function destroy(Request $request, Address $address)
    {
        abort_unless($address->user_id === $request->user()->id, 403);
        $address->delete();
        return response()->json(['message' => 'Deleted']);
    }

    protected function validated(Request $request): array
    {
        return $request->validate([
            'full_name'   => 'required|string|max:120',
            'phone'       => 'required|string|max:30',
            'line1'       => 'required|string|max:255',
            'line2'       => 'nullable|string|max:255',
            'city'        => 'required|string|max:120',
            'state'       => 'nullable|string|max:120',
            'postal_code' => 'required|string|max:20',
            'country'     => 'required|string|size:2',
            'is_default'  => 'sometimes|boolean',
        ]);
    }
}
