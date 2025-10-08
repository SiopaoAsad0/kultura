<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Imagery;

class ImagerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $imageries = [
            [
                'title' => 'Sunrise over Banaue Rice Terraces',
                'description' => 'A breathtaking view of the ancient rice terraces of Banaue as the sun rises over the mountains, casting golden light across the terraced landscape.',
                'file_path' => 'imageries/cordillera/banaue-sunrise.jpg',
                'file_name' => 'banaue-sunrise.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 2048576,
                'width' => 1920,
                'height' => 1080,
                'alt_text' => 'Sunrise over Banaue rice terraces with golden light',
                'category' => 'cordillera',
                'tags' => ['rice terraces', 'banaue', 'sunrise', 'landscape', 'heritage', 'unesco'],
                'location' => 'Banaue, Ifugao',
                'photographer_name' => 'Maria Santos',
                'photographer_email' => 'maria.santos@kultura.com',
                'photographer_bio' => 'Professional photographer specializing in cultural heritage and landscape photography in the Cordillera region.',
                'status' => 'active',
                'is_featured' => true,
                'is_public' => true,
                'views_count' => 1250,
                'likes_count' => 89,
                'metadata' => [
                    'camera' => 'Canon EOS R5',
                    'lens' => '24-70mm f/2.8',
                    'settings' => 'ISO 100, f/8, 1/125s',
                    'date_taken' => '2024-03-15',
                    'time_taken' => '06:30 AM'
                ]
            ],
            [
                'title' => 'Traditional Kalinga Weaver at Work',
                'description' => 'A skilled Kalinga weaver demonstrates the ancient art of traditional textile weaving, creating intricate patterns that tell stories of her culture and heritage.',
                'file_path' => 'imageries/culture/kalinga-weaver.jpg',
                'file_name' => 'kalinga-weaver.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 1536000,
                'width' => 1600,
                'height' => 1200,
                'alt_text' => 'Kalinga woman weaving traditional textiles on a traditional loom',
                'category' => 'culture',
                'tags' => ['weaving', 'kalinga', 'traditional crafts', 'textiles', 'heritage', 'women'],
                'location' => 'Tabuk, Kalinga',
                'photographer_name' => 'Elena Bautista',
                'photographer_email' => 'elena.bautista@kultura.com',
                'photographer_bio' => 'Cultural photographer documenting traditional crafts and indigenous communities in the Cordillera region.',
                'status' => 'active',
                'is_featured' => true,
                'is_public' => true,
                'views_count' => 980,
                'likes_count' => 67,
                'metadata' => [
                    'camera' => 'Sony A7 III',
                    'lens' => '85mm f/1.4',
                    'settings' => 'ISO 400, f/2.8, 1/60s',
                    'date_taken' => '2024-02-28',
                    'time_taken' => '02:15 PM'
                ]
            ],
            [
                'title' => 'Misty Mountains of Sagada',
                'description' => 'The mystical beauty of Sagada\'s mountain landscape shrouded in morning mist, creating an ethereal atmosphere that captivates the soul.',
                'file_path' => 'imageries/landscape/sagada-misty-mountains.jpg',
                'file_name' => 'sagada-misty-mountains.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 2560000,
                'width' => 2048,
                'height' => 1365,
                'alt_text' => 'Misty mountain landscape in Sagada with pine trees',
                'category' => 'landscape',
                'tags' => ['sagada', 'mountains', 'mist', 'landscape', 'nature', 'pine trees'],
                'location' => 'Sagada, Mountain Province',
                'photographer_name' => 'Carlos Reyes',
                'photographer_email' => 'carlos.reyes@kultura.com',
                'photographer_bio' => 'Landscape photographer and nature enthusiast exploring the natural beauty of the Cordillera region.',
                'status' => 'active',
                'is_featured' => false,
                'is_public' => true,
                'views_count' => 756,
                'likes_count' => 45,
                'metadata' => [
                    'camera' => 'Nikon D850',
                    'lens' => '70-200mm f/2.8',
                    'settings' => 'ISO 200, f/5.6, 1/250s',
                    'date_taken' => '2024-01-20',
                    'time_taken' => '07:45 AM'
                ]
            ],
            [
                'title' => 'Ifugao Elder in Traditional Attire',
                'description' => 'A respected Ifugao elder wearing traditional clothing and accessories, representing the wisdom and cultural heritage of the indigenous people.',
                'file_path' => 'imageries/people/ifugao-elder.jpg',
                'file_name' => 'ifugao-elder.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 1800000,
                'width' => 1200,
                'height' => 1600,
                'alt_text' => 'Ifugao elder in traditional clothing and headdress',
                'category' => 'people',
                'tags' => ['ifugao', 'elder', 'traditional clothing', 'portrait', 'heritage', 'wisdom'],
                'location' => 'Banaue, Ifugao',
                'photographer_name' => 'Dr. Roberto Mendoza',
                'photographer_email' => 'roberto.mendoza@kultura.com',
                'photographer_bio' => 'Anthropologist and photographer documenting indigenous cultures and traditions in the Cordillera region.',
                'status' => 'active',
                'is_featured' => true,
                'is_public' => true,
                'views_count' => 892,
                'likes_count' => 56,
                'metadata' => [
                    'camera' => 'Canon EOS R6',
                    'lens' => '50mm f/1.2',
                    'settings' => 'ISO 100, f/2.8, 1/125s',
                    'date_taken' => '2024-03-10',
                    'time_taken' => '10:30 AM'
                ]
            ],
            [
                'title' => 'Traditional Ifugao House Architecture',
                'description' => 'The distinctive architecture of traditional Ifugao houses, built with indigenous materials and techniques that have been passed down through generations.',
                'file_path' => 'imageries/architecture/ifugao-house.jpg',
                'file_name' => 'ifugao-house.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 2200000,
                'width' => 1920,
                'height' => 1280,
                'alt_text' => 'Traditional Ifugao house with thatched roof and wooden structure',
                'category' => 'architecture',
                'tags' => ['ifugao', 'traditional house', 'architecture', 'heritage', 'indigenous', 'construction'],
                'location' => 'Banaue, Ifugao',
                'photographer_name' => 'Ana Dela Cruz',
                'photographer_email' => 'ana.delacruz@kultura.com',
                'photographer_bio' => 'Architectural photographer specializing in traditional and indigenous building techniques in the Cordillera region.',
                'status' => 'active',
                'is_featured' => false,
                'is_public' => true,
                'views_count' => 623,
                'likes_count' => 34,
                'metadata' => [
                    'camera' => 'Sony A7R IV',
                    'lens' => '24-70mm f/2.8',
                    'settings' => 'ISO 100, f/8, 1/60s',
                    'date_taken' => '2024-02-15',
                    'time_taken' => '03:20 PM'
                ]
            ],
            [
                'title' => 'Cordillera Pine Forest',
                'description' => 'A serene view of the Cordillera pine forest, showcasing the unique ecosystem and natural beauty of the mountain region.',
                'file_path' => 'imageries/nature/cordillera-pine-forest.jpg',
                'file_name' => 'cordillera-pine-forest.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 1980000,
                'width' => 1800,
                'height' => 1200,
                'alt_text' => 'Dense pine forest in the Cordillera mountains',
                'category' => 'nature',
                'tags' => ['pine forest', 'cordillera', 'nature', 'trees', 'ecosystem', 'mountains'],
                'location' => 'Baguio, Benguet',
                'photographer_name' => 'Miguel Torres',
                'photographer_email' => 'miguel.torres@kultura.com',
                'photographer_bio' => 'Nature photographer and environmental advocate documenting the natural beauty of the Cordillera region.',
                'status' => 'active',
                'is_featured' => false,
                'is_public' => true,
                'views_count' => 445,
                'likes_count' => 28,
                'metadata' => [
                    'camera' => 'Canon EOS 5D Mark IV',
                    'lens' => '16-35mm f/2.8',
                    'settings' => 'ISO 200, f/11, 1/125s',
                    'date_taken' => '2024-01-08',
                    'time_taken' => '11:15 AM'
                ]
            ],
            [
                'title' => 'Traditional Cañao Ceremony',
                'description' => 'A sacred cañao ceremony being performed by the Cordillera community, showcasing the rich spiritual traditions and cultural practices of the indigenous people.',
                'file_path' => 'imageries/culture/canao-ceremony.jpg',
                'file_name' => 'canao-ceremony.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 1750000,
                'width' => 1600,
                'height' => 1067,
                'alt_text' => 'Traditional cañao ceremony with community members in traditional attire',
                'category' => 'culture',
                'tags' => ['cañao', 'ceremony', 'ritual', 'spirituality', 'community', 'tradition'],
                'location' => 'Bontoc, Mountain Province',
                'photographer_name' => 'Dr. Roberto Mendoza',
                'photographer_email' => 'roberto.mendoza@kultura.com',
                'photographer_bio' => 'Anthropologist and photographer documenting indigenous cultures and traditions in the Cordillera region.',
                'status' => 'active',
                'is_featured' => true,
                'is_public' => true,
                'views_count' => 1120,
                'likes_count' => 78,
                'metadata' => [
                    'camera' => 'Canon EOS R6',
                    'lens' => '24-70mm f/2.8',
                    'settings' => 'ISO 400, f/4, 1/60s',
                    'date_taken' => '2024-02-22',
                    'time_taken' => '04:30 PM'
                ]
            ],
            [
                'title' => 'Banaue Rice Terraces at Harvest Time',
                'description' => 'The magnificent rice terraces of Banaue during harvest season, with golden rice fields creating a stunning mosaic across the mountain landscape.',
                'file_path' => 'imageries/cordillera/banaue-harvest.jpg',
                'file_name' => 'banaue-harvest.jpg',
                'file_type' => 'image/jpeg',
                'file_size' => 2400000,
                'width' => 2048,
                'height' => 1536,
                'alt_text' => 'Golden rice terraces during harvest season in Banaue',
                'category' => 'cordillera',
                'tags' => ['rice terraces', 'banaue', 'harvest', 'agriculture', 'golden', 'landscape'],
                'location' => 'Banaue, Ifugao',
                'photographer_name' => 'Maria Santos',
                'photographer_email' => 'maria.santos@kultura.com',
                'photographer_bio' => 'Professional photographer specializing in cultural heritage and landscape photography in the Cordillera region.',
                'status' => 'active',
                'is_featured' => false,
                'is_public' => true,
                'views_count' => 890,
                'likes_count' => 52,
                'metadata' => [
                    'camera' => 'Canon EOS R5',
                    'lens' => '70-200mm f/2.8',
                    'settings' => 'ISO 100, f/8, 1/250s',
                    'date_taken' => '2024-03-05',
                    'time_taken' => '05:45 PM'
                ]
            ]
        ];

        foreach ($imageries as $imageryData) {
            Imagery::create($imageryData);
        }
    }
}
