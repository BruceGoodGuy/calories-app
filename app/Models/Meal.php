<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    //
    protected $fillable = [
        'name',
        'meal',
        'weight',
        'date',
        'calories',
        'protein',
        'fat',
        'carbs',
        'food_id',
        'user_id',
    ];

    public function food()
    {
        return $this->belongsTo(Food::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
