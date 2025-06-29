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
        Schema::create('tdee_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tdee_id')->constrained('tdee')->onDelete('cascade');
            $table->float('bmi', 8);
            $table->float('bmr', 8);
            $table->float('tdee', 8);
            $table->float('target_calories', 8);
            $table->float('protein', 8);
            $table->float('fat', 8);
            $table->float('carbs', 8);
            $table->json('macros');
            $table->json('macro_ratios');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tdee_details');
    }
};
