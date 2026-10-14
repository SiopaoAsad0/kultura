<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Seed the core demo accounts.
     *
     * Uses updateOrCreate so this seeder is idempotent: running it multiple
     * times never creates duplicate users, and it guarantees the admin,
     * weaver, and customer accounts always exist with the correct role and
     * password. This keeps the admin login working reliably.
     */
    public function run(): void
    {
        $accounts = [
            [
                'name'     => 'Kultura Admin',
                'email'    => 'admin@kultura.com',
                'password' => bcrypt('password'),
                'role'     => 'admin',
            ],
            [
                'name'     => 'John Weaver',
                'email'    => 'weaver@example.com',
                'password' => bcrypt('password'),
                'role'     => 'weaver',
            ],
            [
                'name'     => 'Jane User',
                'email'    => 'user@example.com',
                'password' => bcrypt('password'),
                'role'     => 'user',
            ],
        ];

        foreach ($accounts as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                $account
            );
        }
    }
}
