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
        Schema::create('meals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('meal', ['0', '1', '2', '3']);
            $table->float('weight');
            $table->date('date')->default(now()->toDateString());
            $table->float('calories');
            $table->float('protein');
            $table->float('fat');
            $table->float('carbs');
            $table->unsignedBigInteger('food_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('food_id')->references('id')->on('foods')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};
