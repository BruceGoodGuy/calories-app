<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Food extends Model
{
    use HasFactory;

    protected $table = 'foods';

    protected $fillable = [
        'name',
        'slug',
        'protein_per_100g',
        'fat_per_100g',
        'carbs_per_100g',
        'calories_per_100g',
    ];

    public function scopeSearch($query, string $term, bool $withTrashed = false)
    {
        return $query->when($withTrashed, fn($q) => $q->withTrashed())
            ->where(function ($q) use ($term) {
                $q->whereFullText(['name', 'slug'], $term)
                    ->orWhere('slug', 'like', "%{$term}%");
            });
    }
}
