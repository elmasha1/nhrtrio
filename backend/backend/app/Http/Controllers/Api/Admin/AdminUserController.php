<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $q = User::query()->withCount('orders')->withSum('orders as lifetime_value', 'total');
        if ($s = $request->string('search')->toString()) {
            $q->where(function ($x) use ($s) {
                $x->where('name', 'like', "%$s%")->orWhere('email', 'like', "%$s%");
            });
        }
        if ($r = $request->string('role')->toString()) $q->where('role', $r);
        return $q->latest()->paginate(20);
    }

    public function updateRole(Request $request, User $user)
    {
        $data = $request->validate(['role' => 'required|in:customer,admin']);
        $user->update($data);
        return $user;
    }
}
