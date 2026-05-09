<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stocks = Stock::orderBy('ingredient')->get();
        $lowItemsCount = Stock::whereColumn('quantity', '<=', 'min_threshold')->count();
        $latestItem = Stock::latest()->first();

        return Inertia::render("stock/index", [
            'stocks' => $stocks,
            'totalItems' => Stock::count(),
            'lowItemsCount' => $lowItemsCount,
            'latestItem' => $latestItem
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("stock/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ingredient' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'min_threshold' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        Stock::create($validated);

        return redirect()->back()->with('success', 'Stock item created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $stock = Stock::findOrFail($id);
        return Inertia::render('stock/show', [
            'stock' => $stock
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $stock = Stock::findOrFail($id);
        return Inertia::render('stock/edit', [
            'stock' => $stock
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $stock = Stock::findOrFail($id);

        $validated = $request->validate([
            'ingredient' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'min_threshold' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $stock->update($validated);

        return redirect()->back()->with('success', 'Stock item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $stock = Stock::findOrFail($id);
        $stock->delete();

        return redirect()->route('stock.index')->with('success', 'Stock item deleted successfully.');
    }
}
