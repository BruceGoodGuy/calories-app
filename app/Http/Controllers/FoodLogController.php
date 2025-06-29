<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FoodService;


class FoodLogController extends Controller
{
    //
    protected $foodService;

    public function __construct(FoodService $foodService)
    {
        $this->foodService = $foodService;
    }

    public function index(Request $request)
    {
        $request->validate([
            'date' => 'nullable|date',
        ]);

        $date = $request->input('date', default: now()->format('Y-m-d'));

        if (strtotime($date) > strtotime(now()->format('Y-m-d'))) {
            $date = now()->format('Y-m-d');
        }

        $meals = $this->foodService->getMealsByDate($date);
        $groupedMeals = $meals->groupBy('meal');
        $mealSummaries = $groupedMeals->map(function ($mealItems) {
            return [
                'calories' => $mealItems->sum('calories'),
                'carb' => $mealItems->sum('carb'),
                'fat' => $mealItems->sum('fat'),
                'protein' => $mealItems->sum('protein'),
            ];
        });

        $dailyGoals = $this->foodService->dailyGoals($date);
        return inertia('food-log', [
            'dailyGoals' => $dailyGoals,
            'date' => $date,
            'meals' => $meals,
            'mealSummaries' => $mealSummaries,
            'groupedMeals' => $groupedMeals,
        ]);
    }
}
