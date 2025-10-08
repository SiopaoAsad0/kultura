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
        Schema::create('cultural_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('heritage_origin'); // e.g., 'Ilocos', 'Cordillera', 'Mindanao', etc.
            $table->string('materials_used');
            $table->string('traditional_technique');
            $table->integer('crafting_time_days')->nullable(); // Average time to create
            $table->string('skill_level')->nullable(); // Beginner, Intermediate, Master
            $table->boolean('is_endangered')->default(false);
            $table->string('icon')->nullable();
            $table->string('banner_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cultural_categories');
    }
};
