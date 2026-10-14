<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rider;

class RidersTableSeeder extends Seeder
{
    /**
     * Seed a small pool of simulated delivery riders so the admin
     * Order/Delivery Management System has data to work with immediately.
     */
    public function run(): void
    {
        $riders = [
            ['name' => 'Mario Santos',  'phone' => '0917-123-4567', 'vehicle_type' => 'motorcycle', 'plate_number' => 'ABC 123', 'status' => 'available'],
            ['name' => 'Jose Reyes',    'phone' => '0918-234-5678', 'vehicle_type' => 'motorcycle', 'plate_number' => 'XYZ 789', 'status' => 'available'],
            ['name' => 'Ana Cruz',      'phone' => '0919-345-6789', 'vehicle_type' => 'bicycle',    'plate_number' => null,        'status' => 'available'],
            ['name' => 'Pedro Lim',     'phone' => '0920-456-7890', 'vehicle_type' => 'van',        'plate_number' => 'VAN 456', 'status' => 'available'],
        ];

        foreach ($riders as $rider) {
            Rider::updateOrCreate(['phone' => $rider['phone']], $rider);
        }
    }
}
