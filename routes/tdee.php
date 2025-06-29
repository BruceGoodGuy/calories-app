<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/tdee-calculator', [\App\Http\Controllers\TDEEController::class, 'index'])->name('tdee-calculator');
    Route::post('/tdee-calculator', [\App\Http\Controllers\TDEEController::class, 'calculate'])->name('tdee.calculate');
});
