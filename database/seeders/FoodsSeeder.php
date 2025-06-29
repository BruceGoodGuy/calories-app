<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Food;
use Illuminate\Support\Str;

class FoodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $file = fopen(database_path('seeders/data/foods_data.csv'), 'r');
        fgetcsv($file); // Bỏ qua header

        while (($data = fgetcsv($file)) !== FALSE) {
            $slug = $data[1] ? Str::slug($data[0]) : Str::slug($data[1]);
            if (!Food::where('slug', $slug)->exists()) {
                Food::create([
                    'name' => $data[0],
                    'slug' => $slug,
                    'protein_per_100g' => $data[2],
                    'fat_per_100g' => $data[3],
                    'carbs_per_100g' => $data[4],
                    'calories_per_100g' => $data[5],
                ]);
            }
        }

        fclose($file);
    }
}
