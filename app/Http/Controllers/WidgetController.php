<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Native\Laravel\Facades\Window;
use App\Models\Tdee;
use App\Models\Meal;
use App\Models\TdeeDetail;
use App\Services\FoodService;
use Native\Laravel\Facades\MenuBar;
use Native\Laravel\Facades\Menu;
use Native\Laravel\Facades\App;



class WidgetController extends Controller
{
    protected $foodService;

    public function __construct(FoodService $foodService)
    {
        $this->foodService = $foodService;
    }
    public function index()
    {
        if (auth()->check()) {
            $name = explode(' ', auth()->user()->name)[0];
            $dailyGoals = $this->foodService->dailyGoals();
            return inertia('widgets/unauthenticate-menubar', ['name' => $name, 'dailyGoals' => $dailyGoals, 'authenticated' => true]);
        }
        return inertia('widgets/unauthenticate-menubar', []);
    }

    public function login()
    {
        Window::open('secondary')
            ->width(1000)
            ->height(800)
            ->resizable(false)
            ->route('login');
    }

    public function addMeal()
    {
        Window::open('secondary')
            ->width(1000)
            ->height(800)
            ->resizable(false)
            ->route('food-log');
    }
}
