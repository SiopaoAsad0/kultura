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
        Schema::create('imageries', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_type'); // image/jpeg, image/png, etc.
            $table->integer('file_size'); // in bytes
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('category')->default('cordillera'); // cordillera, culture, landscape, people, etc.
            $table->json('tags')->nullable();
            $table->string('location')->nullable(); // Specific Cordillera location
            $table->string('photographer_name')->nullable();
            $table->string('photographer_email')->nullable();
            $table->text('photographer_bio')->nullable();
            $table->string('status')->default('active'); // active, archived, deleted
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_public')->default(true);
            $table->integer('views_count')->default(0);
            $table->integer('likes_count')->default(0);
            $table->json('metadata')->nullable(); // EXIF data, camera info, etc.
            $table->timestamps();
            
            $table->index(['status', 'is_featured']);
            $table->index(['category', 'status']);
            $table->index(['is_public', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imageries');
    }
};
