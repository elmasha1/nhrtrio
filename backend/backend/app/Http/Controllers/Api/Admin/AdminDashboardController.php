<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = now()->startOfDay();
        $month = now()->startOfMonth();

        $revenue = Order::where('payment_status', 'paid')->sum('total');
        $revenueMonth = Order::where('payment_status', 'paid')->where('created_at', '>=', $month)->sum('total');
        $revenueToday = Order::where('payment_status', 'paid')->where('created_at', '>=', $today)->sum('total');

        $byDay = Order::selectRaw('DATE(created_at) as d, SUM(total) as total, COUNT(*) as cnt')
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('d')->orderBy('d')->get();

        $topProducts = Product::orderByDesc('sold_count')->take(5)->get(['id', 'name', 'price', 'sold_count', 'rating_avg']);

        $byStatus = Order::selectRaw('status, COUNT(*) as c')->groupBy('status')->pluck('c', 'status');

        return response()->json([
            'totals' => [
                'revenue'       => round((float) $revenue, 2),
                'revenue_month' => round((float) $revenueMonth, 2),
                'revenue_today' => round((float) $revenueToday, 2),
                'orders'        => Order::count(),
                'orders_today'  => Order::where('created_at', '>=', $today)->count(),
                'customers'     => User::where('role', 'customer')->count(),
                'products'      => Product::count(),
                'open_chats'    => Conversation::where('status', 'open')->count(),
                'low_stock'     => Product::where('stock', '<', 5)->count(),
            ],
            'sales_by_day'   => $byDay,
            'orders_by_status' => $byStatus,
            'top_products'   => $topProducts,
            'recent_orders'  => Order::with('user:id,name')->latest()->take(8)->get(),
        ]);
    }
}
