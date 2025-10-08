<?php

namespace Database\Seeders;

use App\Models\CulturalCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CulturalCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Inabel Weaving',
                'description' => 'Traditional handwoven textile from Ilocos region, known for its intricate geometric patterns and durability.',
                'heritage_origin' => 'Ilocos Region',
                'materials_used' => 'Cotton, natural dyes',
                'traditional_technique' => 'Handloom weaving',
                'crafting_time_days' => 14,
                'skill_level' => 'Master',
                'is_endangered' => false,
                'icon' => 'spa',
            ],
            [
                'name' => 'Piña Cloth',
                'description' => 'Delicate and luxurious fabric made from pineapple fibers, often used for formal attire like the Barong Tagalog.',
                'heritage_origin' => 'Aklan',
                'materials_used' => 'Pineapple fibers, silk',
                'traditional_technique' => 'Hand-extracted fibers, handwoven',
                'crafting_time_days' => 30,
                'skill_level' => 'Master',
                'is_endangered' => true,
                'icon' => 'layers',
            ],
            [
                'name' => 'T\'nalak Weaving',
                'description' => 'Sacred cloth woven by the T\'boli people, featuring intricate patterns that are said to be inspired by dreams.',
                'heritage_origin' => 'South Cotabato',
                'materials_used' => 'Abaca fibers, natural dyes',
                'traditional_technique' => 'Ikat-dyed abaca weaving',
                'crafting_time_days' => 60,
                'skill_level' => 'Master',
                'is_endangered' => true,
                'icon' => 'filter_drama',
            ],
            [
                'name' => 'Banig Weaving',
                'description' => 'Traditional handwoven mats made from dried leaves, used for sleeping and sitting.',
                'heritage_origin' => 'Samar, Leyte, Basey',
                'materials_used' => 'Tikog leaves, buri palm, pandan leaves',
                'traditional_technique' => 'Hand-weaving, natural dyeing',
                'crafting_time_days' => 7,
                'skill_level' => 'Intermediate',
                'is_endangered' => false,
                'icon' => 'check_box_outline_blank',
            ],
            [
                'name' => 'Bulul Carving',
                'description' => 'Sacred wooden carvings that represent ancestral spirits and are believed to guard rice crops by the Ifugao people.',
                'heritage_origin' => 'Cordillera Region',
                'materials_used' => 'Narra wood, traditional pigments',
                'traditional_technique' => 'Hand-carving, traditional rituals',
                'crafting_time_days' => 21,
                'skill_level' => 'Master',
                'is_endangered' => true,
                'icon' => 'accessibility',
            ],
            [
                'name' => 'Hablon Weaving',
                'description' => 'Colorful handwoven fabric from Iloilo, known for its vibrant patterns and lightweight texture.',
                'heritage_origin' => 'Iloilo',
                'materials_used' => 'Cotton, jusi, piña-silk',
                'traditional_technique' => 'Handloom weaving',
                'crafting_time_days' => 10,
                'skill_level' => 'Intermediate',
                'is_endangered' => false,
                'icon' => 'view_quilt',
            ],
            [
                'name' => 'Yakan Weaving',
                'description' => 'Intricately patterned textiles from Basilan, characterized by bold geometric designs in vibrant colors.',
                'heritage_origin' => 'Basilan',
                'materials_used' => 'Cotton, silk, synthetic threads',
                'traditional_technique' => 'Backstrap loom weaving',
                'crafting_time_days' => 30,
                'skill_level' => 'Master',
                'is_endangered' => true,
                'icon' => 'grid_on',
            ],
            [
                'name' => 'Vinta Making',
                'description' => 'Traditional boat building of the Sama-Bajau people, known for their colorful sails and outriggers.',
                'heritage_origin' => 'Zamboanga, Sulu Archipelago',
                'materials_used' => 'Wood, fiber, abaca, vibrant fabrics',
                'traditional_technique' => 'Wood carving, sail making',
                'crafting_time_days' => 90,
                'skill_level' => 'Master',
                'is_endangered' => true,
                'icon' => 'directions_boat',
            ],
        ];

        foreach ($categories as $category) {
            $slug = Str::slug($category['name']);
            
            CulturalCategory::updateOrCreate(
                ['slug' => $slug],
                array_merge($category, [
                    'slug' => $slug,
                    'banner_image' => "categories/{$slug}-banner.jpg",
                ])
            );
        }
    }
}
