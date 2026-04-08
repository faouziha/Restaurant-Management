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
    Route::resource('menu', MenuController::class);

    //Tables Routes
    Route::resource('tables', TablesController::class);

    //Orders Routes
    Route::resource('orders', OrdersController::class);

    //Stock Routes
    Route::resource('stock', StockController::class);

    //Sales Routes
    Route::resource('sales', SalesController::class);
});

require __DIR__ . '/settings.php';
