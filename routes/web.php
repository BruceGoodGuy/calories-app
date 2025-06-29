<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FoodLogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
