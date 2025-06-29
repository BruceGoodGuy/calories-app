<?php

namespace App\Services;

use App\Models\Tdee;
use App\Models\Meal;

class FoodService
{
    public function dailyGoals($date = null)
    {
        $userId = auth()->id();
        if (!$date) {
            $date = now();
        }
        // Fetch the first active Tdee for the user including its details
        $tdee = Tdee::where('user_id', $userId)->with('tdeeDetails')
            ->where('status', 'active')
            ->first();
        $meals = Meal::where('user_id', $userId)
            ->whereDate('date', $date)
            ->get();

        $currentCalories = $meals->sum(callback: 'calories');
        $currentProtein = $meals->sum('protein');
        $currentCarbs = $meals->sum('carbs');
        $currentFat = $meals->sum('fat');
        if ($tdee) {
            $tdeeDetails = $tdee->tdeeDetails()->first();
        }
        if (!$tdee || !$tdeeDetails) {
            return [
                'calories' => ['current' => 0, 'target' => 0],
                'protein' => ['current' => 0, 'target' => 0],
                'carbs' => ['current' => 0, 'target' => 0],
                'fat' => ['current' => 0, 'target' => 0],
            ];
        }

        return [
            'calories' => ['current' => round($currentCalories), 'target' => round($tdeeDetails->target_calories)],
            'protein' => ['current' => round($currentProtein), 'target' => round($tdeeDetails->protein)],
            'carbs' => ['current' => round($currentCarbs), 'target' => round($tdeeDetails->carbs)],
            'fat' => ['current' => round($currentFat), 'target' => round($tdeeDetails->fat)],
        ];
    }

    public function getMealsByDate($date = null)
    {
        $userId = auth()->id();
        if (!$date) {
            $date = now();
        }

        return Meal::where('user_id', $userId)
            ->whereDate('date', $date)
            ->get();
    }
}
