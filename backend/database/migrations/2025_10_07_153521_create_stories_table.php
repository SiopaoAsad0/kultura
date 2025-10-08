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
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt');
            $table->longText('content');
            $table->string('featured_image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->string('category')->default('cordillera'); // cordillera, culture, heritage, etc.
            $table->json('tags')->nullable();
            $table->string('author_name');
            $table->string('author_email')->nullable();
            $table->text('author_bio')->nullable();
            $table->string('location')->nullable(); // Specific Cordillera location
            $table->string('status')->default('draft'); // draft, published, archived
            $table->boolean('is_featured')->default(false);
            $table->integer('views_count')->default(0);
            $table->integer('likes_count')->default(0);
            $table->json('metadata')->nullable(); // Additional metadata
            $table->timestamps();
            
            $table->index(['status', 'is_featured']);
            $table->index(['category', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};
