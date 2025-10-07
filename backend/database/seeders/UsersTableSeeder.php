<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        // Weaver user
        User::factory()->create([
            'name' => 'John Weaver',
            'email' => 'weaver@example.com',
            'password' => bcrypt('password'),
            'role' => 'weaver', 
        ]);

        // Normal user
        User::factory()->create([
            'name' => 'Jane User',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
            'role' => 'normal', 
        ]);
    }
}
