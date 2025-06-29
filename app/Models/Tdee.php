<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tdee extends Model
{
    use HasFactory;
    protected $table = 'tdee';

    protected $fillable = [
        'user_id',
        'age',
        'gender',
        'weight',
        'height',
        'activityLevel',
        'goal',
        'macroDistribution',
        'weeklyGoal',
        'status',
    ];

    protected $casts = [
        'weight' => 'float',
        'height' => 'float',
        'macroDistribution' => 'string',
    ];

    // Relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // Relationship to TdeeDetails
    public function tdeeDetails()
    {
        return $this->hasOne(TdeeDetail::class);
    }
}
