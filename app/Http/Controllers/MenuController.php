<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menus = Menu::all();
        return Inertia::render("menu/index", [
            'menuItems' => $menus
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('menu/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'description' => 'required|string',
            'sold_out' => 'boolean',
            'image_url' => 'required|image|mimes:jpg,jpeg,png|max:2048', // Max 2MB
        ]);

        $validated['sold_out'] = $request->boolean('sold_out');

        // Handle the image upload
        if ($request->hasFile('image_url')) {
            $path = $request->file('image_url')->store('menus', 'public');
            $validated['image_url'] = $path;
        }

        Menu::create($validated);

        return redirect()->route('menu.index')->with('success', 'Item created!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu)
    {
        Gate::authorize('view', $menu);
        return Inertia::render('menu/show', [
            'menu' => $menu
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Menu $menu)
    {
        Gate::authorize('update', $menu);
        return Inertia::render('menu/edit', [
            'menu' => $menu
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Menu $menu)
    {
        // 1. Authorize the action
        Gate::authorize('update', $menu);

        // 2. Validate the data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'description' => 'required|string',
            'sold_out' => 'boolean',
            // image is nullable here because they might not want to change it
            'image_url' => $request->hasFile('image_url') ? 'image|mimes:jpg,jpeg,png|max:2048' : 'nullable',
        ]);

        $validated['sold_out'] = $request->boolean('sold_out');

        // 3. Handle the image logic
        if ($request->hasFile('image_url')) {
            // Delete the old image if it exists
            if ($menu->image_url) {
                Storage::disk('public')->delete($menu->image_url);
            }

            // Store the new image
            $path = $request->file('image_url')->store('menus', 'public');
            $validated['image_url'] = $path;
        } else {
            // If no new image is uploaded, keep the old one
            unset($validated['image_url']);
        }

        // 4. Update the record
        $menu->update($validated);

        return redirect()->back()->with('success', 'Menu updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        Gate::authorize('delete', $menu);
        $imagePath = $menu->image_url;

        $menu->delete();

        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }
        return redirect()->route('menu.index')
            ->with('success', 'Item deleted successfully.');
    }
}
