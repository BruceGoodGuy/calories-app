<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tdee;

class TDEEController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $tdee = Tdee::where('user_id', $userId)->with('tdeeDetails')->orderBy('created_at', 'DESC')->first();
        if (!$tdee) {
            return inertia('tdee-calculator', [
                'tdee' => null,
                'macros' => null,
            ]);
        }

        return inertia('tdee-calculator', [
            'tdee' => $tdee,
            'macros' => $tdee->tdeeDetails()->first(),
        ]);
    }
    //
    public function calculate(Request $request)
    {
        $validatedData = $request->validate([
            'age' => 'required|integer|min:0',
            'gender' => 'required|in:male,female',
            'weight' => 'required|numeric|min:0',
            'height' => 'required|numeric|min:0',
            'activityLevel' => 'required|in:sedentary,light,moderate,active,very_active',
            'goal' => 'required|in:lose,maintain,gain',
            'macroDistribution' => 'required|in:balanced,high-protein,low-carb,keto',
            'weeklyGoal' => 'nullable|numeric|min:0|max:7',
            'targetWeight' => 'nullable|numeric|min:0',
        ]);

        if ($request->has('isCalculation') && !$request->input('isCalculation')) {
            // If the request is not for calculation, return the TDEE calculator page with existing data
            $userId = auth()->id();
            Tdee::where('user_id', $userId)->where('id', $request->input('id'))->update(['status' => 'active']);
            Tdee::where('user_id', $userId)->where('status', 'active')->where('id', '!=', $request->input('id'))->update(['status' => 'draft']);
            return redirect()->route('tdee-calculator');
        }

        $macros = $this->calculateMacros($validatedData);
        // Insert validated data into the Tdee table
        $validatedData['user_id'] = auth()->id(); // Add user_id to the validated data
        $validatedData['status'] = 'draft'; // Add user_id to the validated data
        // Remove all other TDEE data and TDEE details data for this user
        $tdee = Tdee::create($validatedData);
        // Insert macros data into the tdee_details table
        $tdee->tdeeDetails()->create([
            'tdee_id' => $tdee->id,
            'bmi' => $macros['bmi'],
            'bmr' => $macros['bmr'],
            'tdee' => $macros['tdee'],
            'target_calories' => $macros['target_calories'],
            'protein' => $macros['macros']['protein'],
            'carbs' => $macros['macros']['carbs'],
            'fat' => $macros['macros']['fat'],
            'macros' => json_encode($macros['macros']),
            'macro_ratios' => json_encode($macros['macro_ratios']),
        ]);

        return inertia('tdee-calculator', [
            'tdee' => $tdee,
            'macros' => $macros,
        ]);
    }

    /**
     * Calculate macronutrient distribution based on the provided parameters.
     *
     * @param array $params An associative array containing necessary data for calculation.
     *                      Expected keys:
     *                      - 'calories' (int): Total daily calorie intake.
     *                      - 'protein_ratio' (float): Ratio of calories allocated to protein.
     *                      - 'fat_ratio' (float): Ratio of calories allocated to fat.
     *                      - 'carb_ratio' (float): Ratio of calories allocated to carbohydrates.
     * @return array An associative array containing calculated macronutrient values:
     *               - 'protein' (int): Grams of protein.
     *               - 'fat' (int): Grams of fat.
     *               - 'carbs' (int): Grams of carbohydrates.
     */
    private function calculateMacros($params)
    {
        // Extract parameters
        $age = intval($params['age']);
        $gender = strtolower($params['gender']);
        $weight = floatval($params['weight']);
        $height = floatval($params['height']);
        $activityLevel = strtolower($params['activityLevel']);
        $goal = strtolower($params['goal']);
        $macroDistribution = strtolower($params['macroDistribution']);
        $weeklyGoal = isset($params['weeklyGoal']) ? floatval($params['weeklyGoal']) : 0;

        // 1. Calculate BMI
        $heightInMeters = $height / 100;
        $bmi = $weight / ($heightInMeters * $heightInMeters);

        // 2. Calculate BMR (Mifflin-St Jeor Equation)
        if ($gender === 'male') {
            $bmr = 10 * $weight + 6.25 * $height - 5 * $age + 5;
        } else {
            $bmr = 10 * $weight + 6.25 * $height - 5 * $age - 161;
        }

        // 3. Calculate TDEE based on activity level
        $activityMultipliers = [
            'sedentary' => 1.2,
            'light' => 1.375,
            'moderate' => 1.55,
            'active' => 1.725,
            'very_active' => 1.9
        ];

        $tdee = $bmr * $activityMultipliers[$activityLevel];

        // 4. Adjust calories based on goal
        $weeklyCalorieAdjustments = [
            0.25 => 250,
            0.5 => 500,
            0.75 => 750,
            1.0 => 1000
        ];

        $dailyCalorieAdjustment = 0;

        if ($goal === 'lose') {
            $dailyCalorieAdjustment = - ($weeklyCalorieAdjustments[$weeklyGoal] / 7);
        } elseif ($goal === 'gain') {
            $dailyCalorieAdjustment = $weeklyCalorieAdjustments[$weeklyGoal] / 7;
        }

        $targetCalories = $tdee + $dailyCalorieAdjustment;

        // 5. Macronutrient distribution
        $macroRatios = [
            'balanced' => ['protein' => 0.3, 'carbs' => 0.4, 'fat' => 0.3],
            'high-protein' => ['protein' => 0.35, 'carbs' => 0.35, 'fat' => 0.3],
            'low-carb' => ['protein' => 0.3, 'carbs' => 0.2, 'fat' => 0.5],
            'keto' => ['protein' => 0.25, 'carbs' => 0.05, 'fat' => 0.7]
        ];

        $ratios = $macroRatios[$macroDistribution];

        // Calculate macros in grams
        $proteinGrams = ($targetCalories * $ratios['protein']) / 4;
        $carbsGrams = ($targetCalories * $ratios['carbs']) / 4;
        $fatGrams = ($targetCalories * $ratios['fat']) / 9;

        // 6. Protein recommendation based on goal and activity level
        $proteinMultipliers = [
            'sedentary' => 1.2,
            'light' => 1.4,
            'moderate' => 1.6,
            'active' => 1.8,
            'very_active' => 2.0
        ];

        $proteinPerKg = $proteinMultipliers[$activityLevel];
        if ($goal === 'gain') $proteinPerKg += 0.2;
        if ($goal === 'lose') $proteinPerKg += 0.1;

        $recommendedProtein = $weight * $proteinPerKg;
        $proteinFromRatio = $proteinGrams;

        // Use the higher of the two protein values
        $finalProtein = max($recommendedProtein, $proteinFromRatio);

        // Adjust other macros to compensate for protein change if needed
        $proteinCalories = $finalProtein * 4;
        $remainingCalories = $targetCalories - $proteinCalories;

        // Recalculate carbs and fat based on remaining calories
        $totalNonProteinRatio = $ratios['carbs'] + $ratios['fat'];
        $carbsGrams = ($remainingCalories * ($ratios['carbs'] / $totalNonProteinRatio)) / 4;
        $fatGrams = ($remainingCalories * ($ratios['fat'] / $totalNonProteinRatio)) / 9;

        // Return all calculated values
        return [
            'bmi' => round($bmi, 2),
            'bmr' => round($bmr, 2),
            'tdee' => round($tdee, 2),
            'target_calories' => round($targetCalories, 2),
            'macros' => [
                'protein' => round($finalProtein, 2),
                'carbs' => round($carbsGrams, 2),
                'fat' => round($fatGrams, 2)
            ],
            'macro_ratios' => [
                'protein' => round(($finalProtein * 4 / $targetCalories) * 100, 2),
                'carbs' => round(($carbsGrams * 4 / $targetCalories) * 100, 2),
                'fat' => round(($fatGrams * 9 / $targetCalories) * 100, 2)
            ],
            'parameters' => $params
        ];
    }
}
