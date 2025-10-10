<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, modify the enum to include both 'normal' and 'user'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('weaver', 'normal', 'user') DEFAULT 'user'");
        
        // Then update any existing 'normal' values to 'user'
        DB::table('users')->where('role', 'normal')->update(['role' => 'user']);
        
        // Finally, modify the enum to only include 'user' and 'weaver'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('weaver', 'user') DEFAULT 'user'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Update any 'user' values back to 'normal'
        DB::table('users')->where('role', 'user')->update(['role' => 'normal']);
        
        // Revert the enum back to original
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('weaver', 'normal') DEFAULT 'normal'");
    }
};