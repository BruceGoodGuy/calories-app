<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tdee;
use App\Models\Food;
use App\Models\Meal;
use App\Services\FoodService;

class DashboardController extends Controller
{
    protected $foodService;

    public function __construct(FoodService $foodService)
    {
        $this->foodService = $foodService;
    }
    //
    public function index(Request $request)
    {
        $dailyGoals = $this->foodService->dailyGoals();
        $meals = Meal::where('user_id', $request->user()->id)
            ->whereDate('date', now())
            ->orderBy('meal')
            ->get();

        return inertia('dashboard', [
            'dailyGoals' => $dailyGoals,
            'meals' => $meals,
        ]);
    }

    public function search(Request $request)
    {
        $foods = Food::search($request->q)
            ->limit(10)
            ->get()
            ->map(function ($food) {
                return [
                    'id' => $food->id,
                    'text' => "{$food->name} ({$food->calories_per_100g} cal)",
                    'slug' => $food->slug,
                    'name' => $food->name,
                    'data' => [
                        'protein' => $food->protein_per_100g,
                        'fat' => $food->fat_per_100g,
                        'carbs' => $food->carbs_per_100g,
                        'calories' => $food->calories_per_100g,
                    ]
                ];
            });

        return response()->json([
            'results' => $foods,
        ]);
    }

    public function storeMeal(Request $request)
    {
        $validatedData = $request->validate([
            'food' => 'required|array',
            'food.id' => 'required|integer|exists:foods,id',
            'food.text' => 'required|string|max:255',
            'food.slug' => 'required|string|max:255',
            'food.name' => 'required|string|max:255',
            'food.data' => 'required|array',
            'food.data.protein' => 'required|numeric',
            'food.data.fat' => 'required|numeric',
            'food.data.carbs' => 'required|numeric',
            'food.data.calories' => 'required|numeric',
            'meal' => 'required|integer|in:0,1,2,3',
            'weight' => 'required|numeric|min:0',
            'date' => 'nullable|date|before_or_equal:today',
        ]);

        $storeData = [
            'name' => $validatedData['food']['name'],
            'meal' => $validatedData['meal'],
            'weight' => $validatedData['weight'],
            'date' => $validatedData['date'] ?? now()->toDateString(),
            'calories' => $validatedData['food']['data']['calories'] * ($validatedData['weight'] / 100),
            'protein' => $validatedData['food']['data']['protein'] * ($validatedData['weight'] / 100),
            'fat' => $validatedData['food']['data']['fat'] * ($validatedData['weight'] / 100),
            'carbs' => $validatedData['food']['data']['carbs'] * ($validatedData['weight'] / 100),
            'food_id' => $validatedData['food']['id'],
            'user_id' => $request->user()->id,
        ];

        Meal::create($storeData);

        return redirect()->route('dashboard');
    }

    public function destroyMeal(Request $request)
    {
        $validatedData = $request->validate([
            'id' => 'required|integer|exists:meals,id',
        ]);

        Meal::where('id', $validatedData['id'])
            ->where('user_id', $request->user()->id)
            ->delete();

        return redirect()->route('dashboard');
    }
}
