<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Order;
use App\Models\Stock;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // KPIs
        $totalEmployees = User::count();
        $totalOrders = Order::count();
        $totalSales = Order::where('status', 'completed')->sum('total_price');
        $totalMenuItems = Menu::count();

        // Chart 1: Sales over the last 7 days
        $salesTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $sales = Order::whereDate('created_at', $date)
                ->where('status', 'completed')
                ->sum('total_price');
            
            $salesTrend[] = [
                'name' => Carbon::parse($date)->format('D'), // Mon, Tue, etc.
                'total' => $sales
            ];
        }

        // Chart 2: Order Status Distribution
        $statuses = Order::select('status', \DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();
            
        $orderStatusDistribution = $statuses->map(function ($status) {
            return [
                'name' => ucfirst($status->status),
                'value' => $status->total
            ];
        });

        // Top 5 Menu Items (optional if order_items has relations setup properly)
        $topMenuItems = \DB::table('order_items')
            ->join('menus', 'order_items.menu_id', '=', 'menus.id')
            ->select('menus.name', \DB::raw('count(*) as orders_count'))
            ->groupBy('order_items.menu_id', 'menus.name')
            ->orderByDesc('orders_count')
            ->limit(5)
            ->get();

        // Recent Orders
        $recentOrders = Order::with('table')
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        // Stock Alerts
        $lowStockCount = Stock::whereColumn('quantity', '<=', 'min_threshold')->count();
        $lowStockItems = Stock::whereColumn('quantity', '<=', 'min_threshold')->take(5)->get();

        return Inertia::render('dashboard', [
            'metrics' => [
                'totalEmployees' => $totalEmployees,
                'totalOrders' => $totalOrders,
                'totalSales' => $totalSales,
                'totalMenuItems' => $totalMenuItems,
                'lowStockCount' => $lowStockCount,
            ],
            'salesTrend' => $salesTrend,
            'orderStatusDistribution' => $orderStatusDistribution,
            'topMenuItems' => $topMenuItems,
            'recentOrders' => $recentOrders,
            'lowStockItems' => $lowStockItems,
        ]);
    }
}
