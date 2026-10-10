<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
class ProductsTableSeeder extends Seeder
{
    public function run()
    {
        $weaver = User::where('email', 'weaver@example.com')->first()
            ?? User::where('role', 'weaver')->first();
        if (!$weaver) {
            $this->command?->error('No weaver user found. Seed users before products.');
            return;
        }
        $photosDir = dirname(base_path()) . DIRECTORY_SEPARATOR . 'frontend' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'Photos';
        $products = [         
            [
                'title' => 'Handwoven Bag',
                'story' => 'Beautiful handwoven bag made by local weaver.',
                'stock' => 10,
                'price' => 500,
                'photo' => 'Handwoven Bag.jpg',
            ],
            [
                'title' => 'Beaded Necklace',
                'story' => 'Traditional beaded necklace handcrafted by local artisan.',
                'stock' => 15,
                'price' => 300,
                'photo' => 'Necklace.jpg',
            ],
            [
                'title' => 'Woven Mat',
                'story' => 'Durable woven mat made from natural fibers.',
                'stock' => 20,
                'price' => 250,
                'photo' => 'Handmade Mat.jpg',
            ],
            [
                'title' => 'Bamboo Basket',
                'story' => 'Eco-friendly bamboo basket for daily use.',
                'stock' => 12,
                'price' => 150,
                'photo' => 'Handmade Bamboo.jpg',
            ],
             [
                'title' => 'Clay Pot',
                'story' => 'Handmade clay pot for kitchen or decoration.',
                'stock' => 8,
                'price' => 400,
                'photo' => 'ClayPot.jpg',
            ],
            [
                'title' => 'Wooden Spoon Set',
                'story' => 'Carved wooden spoons for cooking.',
                'stock' => 25,
                'price' => 200,
                'photo' => 'Wood  Utensils Set.jpg',
            ],
            [
                'title' => 'Rattan Chair',
                'story' => 'Comfortable rattan chair for home.',
                'stock' => 5,
                'price' => 1200,
                'photo' => 'Rattan Chair.jpg',
            ],
            [
                'title' => 'Leather Wallet',
                'story' => 'Hand-stitched leather wallet.',
                'stock' => 18,
                'price' => 350,
                'photo' => 'Bifold Leather Wallet.jpg',
            ],
            [
                'title' => 'Handmade Scarf',
                'story' => 'Soft scarf woven by local artisans.',
                'stock' => 22,
                'price' => 280,
                'photo' => 'HandmadeScarf.jpg',
            ],
            [
                'title' => 'Woven Hat',
                'story' => 'Stylish hat made from natural fibers.',
                'stock' => 14,
                'price' => 220,
                'photo' => 'Salakot.jpg',
            ],
            [
                'title' => 'Beaded Bracelet',
                'story' => 'Colorful beaded bracelet for all ages.',
                'stock' => 30,
                'price' => 180,
                'photo' => 'Bracelet.jpg',
            ],
            [
                'title' => 'Ceramic Mug',
                'story' => 'Hand-painted ceramic mug.',
                'stock' => 20,
                'price' => 320,
                'photo' => 'Pottery Mug.jpg',
            ],
             [
                'title' => 'Woven Table Runner',
                'story' => 'Elegant table runner for decoration.',
                'stock' => 10,
                'price' => 450,
                'photo' => null,
            ],
            [
                'title' => 'Wooden Jewelry Box',
                'story' => 'Carved jewelry box for keepsakes.',
                'stock' => 7,
                'price' => 600,
                'photo' => null,
            ],
            [
                'title' => 'Handcrafted Candle Holder',
                'story' => 'Beautiful candle holder made from wood.',
                'stock' => 12,
                'price' => 380,
                'photo' => null,
            ],
        ];

               foreach ($products as $product) {
            $imageUrl = $this->attachProductPhoto($photosDir, $product['photo'] ?? null);
            Product::updateOrCreate(
                [
                    'title' => $product['title'],
                    'weaver_id' => $weaver->id,
                ],
                [
                    'story' => $product['story'],
                    'stock' => $product['stock'],
                    'price' => $product['price'],
                    'image_url' => $imageUrl,
                    'is_handmade' => true,
                    'supports_artisan' => true,
                ]
            );
        }
    }

    /**
     * Copy a photo from frontend/public/Photos into Laravel storage
     * and return a public URL the React app can load.
     */
    private function attachProductPhoto(string $photosDir, ?string $filename): ?string
    {
        if (!$filename) {
            return null;
        }
        $source = $photosDir . DIRECTORY_SEPARATOR . $filename;
        if (!File::exists($source)) {
            $this->command?->warn("Photo not found: {$filename}");
            return '/Photos/' . str_replace(' ', '%20', $filename);
        }
        $storedName = Str::slug(pathinfo($filename, PATHINFO_FILENAME)) . '.' . strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        Storage::disk('public')->putFileAs('products', new \Illuminate\Http\File($source), $storedName);
        // React serves files from frontend/public, so /Photos/... works in the browser.
        return '/Photos/' . str_replace(' ', '%20', $filename);
    }
}