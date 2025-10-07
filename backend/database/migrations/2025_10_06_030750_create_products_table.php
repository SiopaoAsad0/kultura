<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');            // Product title
            $table->text('story');              // Story or description
            $table->integer('stock')->default(0);
            $table->decimal('price', 10, 2);   // Price in local currency
            $table->unsignedBigInteger('weaver_id'); // Foreign key to users table
            $table->string('image')->nullable();     // Optional image URL
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('weaver_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
