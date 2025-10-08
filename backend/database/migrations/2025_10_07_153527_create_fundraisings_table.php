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
        Schema::create('fundraisings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->longText('full_description');
            $table->string('featured_image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->string('category')->default('cordillera'); // cordillera, community, education, etc.
            $table->json('tags')->nullable();
            $table->string('organizer_name');
            $table->string('organizer_email');
            $table->text('organizer_bio')->nullable();
            $table->string('location')->nullable(); // Specific Cordillera location
            $table->decimal('target_amount', 15, 2);
            $table->decimal('current_amount', 15, 2)->default(0);
            $table->string('currency', 3)->default('PHP');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('active'); // active, completed, cancelled, suspended
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->integer('donors_count')->default(0);
            $table->json('updates')->nullable(); // Campaign updates
            $table->json('metadata')->nullable(); // Additional metadata
            $table->timestamps();
            
            $table->index(['status', 'is_featured']);
            $table->index(['category', 'status']);
            $table->index(['start_date', 'end_date']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fundraisings');
    }
};
