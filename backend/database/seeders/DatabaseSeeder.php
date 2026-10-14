<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Cultural Categories Seed (run first as products depend on categories)
        $this->call(CulturalCategoriesTableSeeder::class);
        
        // User Seed
        $this->call(UsersTableSeeder::class);

        // Delivery riders (for the admin Order/Delivery Management System)
        $this->call(RidersTableSeeder::class);

        // Product Seed (runs after categories and users)
        $this->call([
            ProductsTableSeeder::class,
        ]);

        // New Content Seeders
        $this->call([
            StorySeeder::class,
            FundraisingSeeder::class,
            ImagerySeeder::class,
        ]);
    }
}
