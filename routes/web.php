<?php

use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\TablesController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    //Employees Routes
    Route::resource('employees', EmployeesController::class);

    //Menu Routes
    Route::get('menu', [MenuController::class, 'index'])->name('menu.index');

    //Tables Routes
    Route::get('tables', [TablesController::class, 'index'])->name('tables.index');

    //Orders Routes
    Route::get('orders', [OrdersController::class, 'index'])->name('orders.index');

    //Stock Routes
    Route::get('stock', [StockController::class, 'index'])->name('stock.index');

    //Sales Routes
    Route::get('sales', [SalesController::class, 'index'])->name('sales.index');
});

require __DIR__ . '/settings.php';
