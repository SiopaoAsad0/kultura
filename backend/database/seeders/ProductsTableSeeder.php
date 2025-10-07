<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductsTableSeeder extends Seeder
{
    public function run()
    {
        $products = [
            ['Handwoven Bag', 'Beautiful handwoven bag made by local weaver.', 10, 500],
            ['Beaded Necklace', 'Traditional beaded necklace handcrafted by local artisan.', 15, 300],
            ['Woven Mat', 'Durable woven mat made from natural fibers.', 20, 250],
            ['Bamboo Basket', 'Eco-friendly bamboo basket for daily use.', 12, 150],
            ['Clay Pot', 'Handmade clay pot for kitchen or decoration.', 8, 400],
            ['Wooden Spoon Set', 'Carved wooden spoons for cooking.', 25, 200],
            ['Rattan Chair', 'Comfortable rattan chair for home.', 5, 1200],
            ['Leather Wallet', 'Hand-stitched leather wallet.', 18, 350],
            ['Handmade Scarf', 'Soft scarf woven by local artisans.', 22, 280],
            ['Woven Hat', 'Stylish hat made from natural fibers.', 14, 220],
            ['Beaded Bracelet', 'Colorful beaded bracelet for all ages.', 30, 180],
            ['Ceramic Mug', 'Hand-painted ceramic mug.', 20, 320],
            ['Woven Table Runner', 'Elegant table runner for decoration.', 10, 450],
            ['Wooden Jewelry Box', 'Carved jewelry box for keepsakes.', 7, 600],
            ['Handcrafted Candle Holder', 'Beautiful candle holder made from wood.', 12, 380],
        ];

        foreach ($products as $p) {
            Product::create([
                'title' => $p[0],
                'story' => $p[1],
                'stock' => $p[2],
                'price' => $p[3],
                'weaver_id' => 1, // Replace with your actual weaver user ID
            ]);
        }
    }
}
