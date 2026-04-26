<?php

namespace App\Http\Controllers;

use App\Models\Table;
use App\TableStatus;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class TablesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $table = Table::all();
        return Inertia::render("tables/index", [
            'tables' => $table
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $waiters = User::where('type', \App\UserType::STAFF)->get(['id', 'name']);
        
        return Inertia::render('tables/create', [
            'waiters' => $waiters
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'number' => 'required|integer|min:1|unique:tables',
            'waiter_id' => 'nullable|exists:users,id',
            'status' => ['required', Rule::enum(TableStatus::class)],
        ]);

        Table::create($validated);
        return redirect()->back()->with('success', 'Table created!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Table $table)
    {
        Gate::authorize('view', $table);
        return Inertia::render('tables/show', [
            'table' => $table
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Table $table)
    {
        Gate::authorize('update', $table);
        
        $waiters = User::where('type', \App\UserType::STAFF)->get(['id', 'name']);
        
        return Inertia::render('tables/edit', [
            'table' => $table,
            'waiters' => $waiters
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Table $table)
    {
        Gate::authorize('update', $table);
        
        $validated = $request->validate([
            'number' => ['sometimes', 'required', 'integer', 'min:1', Rule::unique('tables')->ignore($table->id)],
            'waiter_id' => ['nullable', 'exists:users,id'],
            'status' => ['sometimes', 'required', Rule::enum(\App\TableStatus::class)],
            'position_x' => ['nullable', 'integer'],
            'position_y' => ['nullable', 'integer'],
        ]);

        $table->update($validated);
        
        if ($request->wantsJson()) {
            return response()->json(['message' => 'Table position updated']);
        }
        
        return redirect('/tables')->with('success', 'Table updated!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Table $table)
    {
        Gate::authorize('delete', $table);
        $table->delete();
        return redirect('/tables')->with('success', 'Table deleted!');
    }
}
