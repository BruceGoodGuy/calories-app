<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/tdee-calculator', [\App\Http\Controllers\TDEEController::class, 'index'])->name('tdee-calculator');
    // Route::get('/tdee-calculator', function () {
    //     return Inertia::render('tdee-calculator');
    // })->name('tdee-calculator');
    Route::post('/tdee-calculator', [\App\Http\Controllers\TDEEController::class, 'calculate'])->name('tdee.calculate');
});
