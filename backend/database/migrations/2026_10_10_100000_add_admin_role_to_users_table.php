<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('weaver', 'user', 'admin') DEFAULT 'user'");
    }

    public function down(): void
    {
        DB::table('users')->where('role', 'admin')->update(['role' => 'user']);
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('weaver', 'user') DEFAULT 'user'");
    }
};
