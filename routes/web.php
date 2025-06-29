<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FoodLogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\WidgetController;
use App\Http\Controllers\AppController;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/tdee.php';
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/food-log', [FoodLogController::class, 'index'])->name('food-log');
    Route::get('/history', function () {
        return Inertia::render('history');
    })->name('history');
    Route::get('/foods', [DashboardController::class, 'search'])->name('foods.search');
    Route::post('/meals', [DashboardController::class, 'storeMeal'])->name('meals.store');
    Route::post('/delete-meals', [DashboardController::class, 'destroyMeal'])->name('meals.destroy');
});

Route::group(['prefix' => 'widget'], routes: function () {
    Route::get('/menubar', [WidgetController::class, 'index'])->name('widget.menubar');
    Route::get('/action/login', [WidgetController::class, 'login'])->name('widget.login');
    Route::get('/action/add-meal', [WidgetController::class, 'addMeal'])->name('widget.add-meal');
});

Route::group(['prefix' => 'app'], routes: function () {
    Route::get('/quit', [AppController::class, 'quit'])->name('app.quit');
    Route::get('/relaunch', [AppController::class, 'relaunch'])->name('app.relaunch');
    Route::get('/test', [AppController::class, 'test'])->name('app.test');
});