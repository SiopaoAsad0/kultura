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
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('cultural_category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('heritage_origin')->nullable()->after('weaver_id');
            $table->string('materials_used')->nullable();
            $table->text('cultural_significance')->nullable();
            $table->string('crafting_technique')->nullable();
            $table->integer('crafting_time_hours')->nullable();
            $table->string('artisan_story')->nullable();
            $table->json('cultural_images')->nullable();
            $table->boolean('is_handmade')->default(true);
            $table->boolean('is_fair_trade')->default(false);
            $table->boolean('supports_artisan')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['cultural_category_id']);
            $table->dropColumn([
                'cultural_category_id',
                'heritage_origin',
                'materials_used',
                'cultural_significance',
                'crafting_technique',
                'crafting_time_hours',
                'artisan_story',
                'cultural_images',
                'is_handmade',
                'is_fair_trade',
                'supports_artisan'
            ]);
        });
    }
};
