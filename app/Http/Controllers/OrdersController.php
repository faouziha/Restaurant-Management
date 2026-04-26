<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use App\Models\Menu;
use App\UserType;
use App\OrderType;
use App\OrdersItemsStatus;
use App\OrderStatus;
use App\Models\OrderItem;
use Illuminate\Support\Arr;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::all();
        return Inertia::render("orders/index", [
            'orders' => $orders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tables = Table::all();
        $waiters = User::where('type', UserType::STAFF->value)->get();
        $menuItems = Menu::all();
        
        $orderTypes = array_map(function($case) {
            return ['value' => $case->value, 'label' => $case->label()];
        }, OrderType::cases());

        return Inertia::render("orders/create", [
            'tables' => $tables,
            'waiters' => $waiters,
            'orderTypes' => $orderTypes,
            'menuItems' => $menuItems
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'waiter_id' => 'required|exists:users,id',
            'type' => 'required|string',
            'table_id' => 'nullable|exists:tables,id',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ]);

        $totalPrice = 0;
        $orderItemsData = [];

        // Fetch all requested menus to get accurate pricing
        $menuIds = collect($validated['items'])->pluck('menu_id');
        $menus = Menu::whereIn('id', $menuIds)->get()->keyBy('id');

        foreach ($validated['items'] as $item) {
            $menu = $menus[$item['menu_id']];
            $unitPrice = $menu->price;
            $totalPrice += $unitPrice * $item['quantity'];

            $orderItemsData[] = [
                'menu_id' => $item['menu_id'],
                'quantity' => $item['quantity'],
                'notes' => $item['notes'] ?? null,
                'status' => OrdersItemsStatus::PENDING->value,
                'unit_price' => $unitPrice,
            ];
        }

        $orderData = array_merge(
            Arr::except($validated, ['items']), 
            [
                'user_id' => auth()->id(),
                'status' => OrderStatus::PENDING->value,
                'total_price' => $totalPrice,
            ]
        );

        $order = Order::create($orderData);

        foreach ($orderItemsData as $itemData) {
            $itemData['order_id'] = $order->id;
            OrderItem::create($itemData);
        }

        return redirect()->back()->with('success', 'Order created successfully.');
    }

    public function show(string $id)
    {
        $order = Order::with(['table', 'waiter', 'items.menu'])->findOrFail($id);

        return Inertia::render('orders/show', [
            'order' => $order
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $order = Order::with(['items.menu'])->findOrFail($id);
        $tables = Table::all();
        $waiters = User::where('type', UserType::STAFF->value)->get();
        $menuItems = Menu::all();
        
        $orderTypes = array_map(function($case) {
            return ['value' => $case->value, 'label' => $case->label()];
        }, OrderType::cases());

        $orderStatuses = array_map(function($case) {
            return ['value' => $case->value, 'label' => $case->label()];
        }, OrderStatus::cases());

        return Inertia::render('orders/edit', [
            'order' => $order,
            'tables' => $tables,
            'waiters' => $waiters,
            'menuItems' => $menuItems,
            'orderTypes' => $orderTypes,
            'orderStatuses' => $orderStatuses
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'waiter_id' => 'required|exists:users,id',
            'type' => 'required|string',
            'table_id' => 'nullable|exists:tables,id',
            'status' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ]);

        $totalPrice = 0;
        
        $menuIds = collect($validated['items'])->pluck('menu_id');
        $menus = Menu::whereIn('id', $menuIds)->get()->keyBy('id');

        // Delete items that are no longer in the request
        $submittedMenuIds = $menuIds->toArray();
        OrderItem::where('order_id', $order->id)
            ->whereNotIn('menu_id', $submittedMenuIds)
            ->delete();

        foreach ($validated['items'] as $item) {
            $menu = $menus[$item['menu_id']];
            $unitPrice = $menu->price;
            $totalPrice += $unitPrice * $item['quantity'];

            OrderItem::updateOrCreate(
                ['order_id' => $order->id, 'menu_id' => $item['menu_id']],
                [
                    'quantity' => $item['quantity'],
                    'notes' => $item['notes'] ?? null,
                    'unit_price' => $unitPrice,
                ]
            );
        }

        $orderData = array_merge(
            Arr::except($validated, ['items']), 
            [
                'total_price' => $totalPrice,
            ]
        );

        $order->update($orderData);

        return redirect()->back()->with('success', 'Order updated successfully.');
    }

    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return redirect()->route('orders.index')->with('success', 'Order deleted successfully.');
    }
}
