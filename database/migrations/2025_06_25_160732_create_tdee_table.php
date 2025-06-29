<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tdee', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('age');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->decimal('weight', 5, 2);
            $table->decimal('height', 5, 2)->nullable();

            $table->enum('activityLevel', [
                'sedentary',      // little to no exercise
                'light',          // light exercise/sports 1–3 days/week
                'moderate',       // moderate exercise 3–5 days/week
                'active',         // hard exercise 6–7 days/week
                'very_active'     // very intense exercise, physical job
            ]);
            $table->enum('goal', ['lose', 'maintain', 'gain']);
            $table->enum('macroDistribution', ['balanced', 'high-protein', 'low-carb', 'keto']);
            $table->enum('weeklyGoal', ['0.25', '0.5', '0.75', '1'])->nullable();
            $table->enum('status', ['draft', 'active'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tdee');
    }
};
