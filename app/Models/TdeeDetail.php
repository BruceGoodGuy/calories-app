<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TdeeDetail extends Model
{
    //
    protected $table = 'tdee_details';
    protected $fillable = [
        'tdee_id',
        'bmi',
        'bmr',
        'tdee',
        'target_calories',
        'protein',
        'fat',
        'carbs',
        'macros',
        'macro_ratios',
    ];

    public function tdee()
    {
        return $this->belongsTo(Tdee::class, 'tdee_id', 'id');
    }
}
