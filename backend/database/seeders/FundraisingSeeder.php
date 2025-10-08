<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Fundraising;
use Carbon\Carbon;

class FundraisingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fundraisings = [
            [
                'title' => 'Preserve the Banaue Rice Terraces for Future Generations',
                'slug' => 'preserve-banaue-rice-terraces-future-generations',
                'description' => 'Help preserve the ancient rice terraces of Banaue, a UNESCO World Heritage Site, through community-led conservation efforts and sustainable tourism development.',
                'full_description' => 'The Banaue Rice Terraces, often called the "Eighth Wonder of the World," are facing unprecedented challenges from climate change, urbanization, and the migration of young people to cities. This campaign aims to support local communities in preserving this incredible heritage through:

1. **Conservation and Restoration**: Repair damaged terraces and restore traditional irrigation systems
2. **Community Training**: Train local youth in traditional farming and terrace maintenance techniques
3. **Sustainable Tourism**: Develop eco-friendly tourism programs that benefit local communities
4. **Documentation**: Record traditional knowledge and practices for future generations
5. **Infrastructure**: Improve access roads and facilities for both locals and visitors

Your support will help ensure that the rice terraces continue to be a source of pride, livelihood, and cultural identity for the Ifugao people for generations to come.',
                'category' => 'cordillera',
                'tags' => ['rice terraces', 'banaue', 'conservation', 'unesco', 'heritage', 'sustainability'],
                'organizer_name' => 'Banaue Heritage Foundation',
                'organizer_email' => 'info@banaueheritage.org',
                'organizer_bio' => 'A non-profit organization dedicated to preserving the cultural heritage and natural beauty of the Banaue region.',
                'location' => 'Banaue, Ifugao',
                'target_amount' => 500000.00,
                'current_amount' => 125000.00,
                'currency' => 'PHP',
                'start_date' => Carbon::now()->subDays(30),
                'end_date' => Carbon::now()->addDays(60),
                'status' => 'active',
                'is_featured' => true,
                'is_verified' => true,
                'donors_count' => 45,
                'updates' => [
                    [
                        'date' => Carbon::now()->subDays(5)->toDateString(),
                        'title' => 'First Phase of Restoration Complete',
                        'content' => 'We have successfully completed the restoration of 50 meters of damaged terraces in the central area. The traditional irrigation system is now fully functional.'
                    ],
                    [
                        'date' => Carbon::now()->subDays(15)->toDateString(),
                        'title' => 'Community Training Program Launched',
                        'content' => 'Twenty young people from the local community have started their training in traditional farming techniques and terrace maintenance.'
                    ]
                ],
                'metadata' => [
                    'featured_image_alt' => 'Aerial view of Banaue rice terraces',
                    'gallery_count' => 8,
                    'verification_documents' => ['certificate_of_registration', 'project_proposal', 'community_agreement']
                ]
            ],
            [
                'title' => 'Support Kalinga Weaving Communities: Preserve Traditional Textile Arts',
                'slug' => 'support-kalinga-weaving-communities-preserve-textile-arts',
                'description' => 'Help preserve the ancient art of Kalinga weaving by supporting local weavers, providing training materials, and creating sustainable income opportunities.',
                'full_description' => 'The traditional weaving techniques of the Kalinga people are at risk of being lost as younger generations migrate to cities and modern textile production replaces traditional methods. This campaign aims to:

1. **Weaver Training Programs**: Provide comprehensive training in traditional weaving techniques to young people
2. **Equipment and Materials**: Supply traditional looms, natural dyes, and high-quality fibers
3. **Market Development**: Create sustainable markets for authentic Kalinga textiles
4. **Cultural Documentation**: Record traditional patterns, techniques, and cultural significance
5. **Community Workshops**: Organize regular workshops to share knowledge and skills

The Kalinga people have been creating beautiful textiles for centuries, with each pattern telling a story of their culture and environment. Your support will help ensure these traditions continue to thrive and provide sustainable livelihoods for local communities.',
                'category' => 'community',
                'tags' => ['weaving', 'kalinga', 'textiles', 'traditional crafts', 'cultural preservation', 'livelihood'],
                'organizer_name' => 'Kalinga Weavers Cooperative',
                'organizer_email' => 'coop@kalingaweavers.org',
                'organizer_bio' => 'A cooperative of traditional weavers working to preserve and promote Kalinga textile arts while creating sustainable livelihoods.',
                'location' => 'Tabuk, Kalinga',
                'target_amount' => 300000.00,
                'current_amount' => 75000.00,
                'currency' => 'PHP',
                'start_date' => Carbon::now()->subDays(20),
                'end_date' => Carbon::now()->addDays(40),
                'status' => 'active',
                'is_featured' => true,
                'is_verified' => true,
                'donors_count' => 28,
                'updates' => [
                    [
                        'date' => Carbon::now()->subDays(3)->toDateString(),
                        'title' => 'New Loom Equipment Delivered',
                        'content' => 'Five traditional looms have been delivered to the community center. Local weavers are excited to start using the new equipment.'
                    ]
                ],
                'metadata' => [
                    'featured_image_alt' => 'Kalinga woman weaving traditional textiles',
                    'gallery_count' => 6,
                    'verification_documents' => ['cooperative_registration', 'project_proposal', 'community_agreement']
                ]
            ],
            [
                'title' => 'Emergency Relief for Cordillera Communities Affected by Typhoon',
                'slug' => 'emergency-relief-cordillera-communities-typhoon',
                'description' => 'Provide immediate relief and support to Cordillera communities affected by recent typhoon damage, including food, shelter, and infrastructure repair.',
                'full_description' => 'Recent typhoon activity has caused significant damage to several communities in the Cordillera region, including:

1. **Immediate Relief**: Food, clean water, and emergency shelter for affected families
2. **Infrastructure Repair**: Fix damaged roads, bridges, and community facilities
3. **Agricultural Recovery**: Support farmers in replanting crops and restoring damaged terraces
4. **Medical Assistance**: Provide healthcare services and medical supplies
5. **Long-term Recovery**: Help communities build back stronger and more resilient

The Cordillera people are resilient, but they need our support to recover from this natural disaster. Your contribution will help provide immediate relief and support long-term recovery efforts.',
                'category' => 'emergency',
                'tags' => ['emergency relief', 'typhoon', 'disaster response', 'community support', 'recovery'],
                'organizer_name' => 'Cordillera Disaster Response Network',
                'organizer_email' => 'relief@cordilleraresponse.org',
                'organizer_bio' => 'A network of local organizations providing emergency response and disaster relief services in the Cordillera region.',
                'location' => 'Multiple locations, Cordillera',
                'target_amount' => 750000.00,
                'current_amount' => 200000.00,
                'currency' => 'PHP',
                'start_date' => Carbon::now()->subDays(10),
                'end_date' => Carbon::now()->addDays(30),
                'status' => 'active',
                'is_featured' => false,
                'is_verified' => true,
                'donors_count' => 67,
                'updates' => [
                    [
                        'date' => Carbon::now()->subDays(2)->toDateString(),
                        'title' => 'Emergency Relief Distribution Complete',
                        'content' => 'Food and water supplies have been distributed to 200 affected families. Medical teams are now providing healthcare services.'
                    ]
                ],
                'metadata' => [
                    'featured_image_alt' => 'Community members receiving emergency relief supplies',
                    'gallery_count' => 4,
                    'verification_documents' => ['disaster_declaration', 'relief_plan', 'community_assessment']
                ]
            ],
            [
                'title' => 'Build a Cultural Learning Center in Sagada',
                'slug' => 'build-cultural-learning-center-sagada',
                'description' => 'Help build a cultural learning center in Sagada to preserve and share the rich heritage of the Cordillera people with future generations.',
                'full_description' => 'The proposed cultural learning center in Sagada will serve as a hub for preserving and sharing the rich cultural heritage of the Cordillera people. The center will include:

1. **Museum and Exhibition Space**: Display traditional artifacts, textiles, and cultural items
2. **Learning Workshops**: Regular workshops on traditional crafts, music, and dance
3. **Library and Archive**: Collection of books, documents, and recordings about Cordillera culture
4. **Performance Space**: Venue for traditional music, dance, and storytelling
5. **Community Meeting Room**: Space for community gatherings and cultural events

This center will be a place where young people can learn about their heritage, where visitors can experience the beauty of Cordillera culture, and where the community can come together to celebrate their traditions.',
                'category' => 'education',
                'tags' => ['cultural center', 'sagada', 'education', 'heritage preservation', 'community development'],
                'organizer_name' => 'Sagada Cultural Heritage Society',
                'organizer_email' => 'info@sagadaheritage.org',
                'organizer_bio' => 'A community organization dedicated to preserving and promoting the cultural heritage of Sagada and the surrounding Cordillera region.',
                'location' => 'Sagada, Mountain Province',
                'target_amount' => 800000.00,
                'current_amount' => 150000.00,
                'currency' => 'PHP',
                'start_date' => Carbon::now()->subDays(45),
                'end_date' => Carbon::now()->addDays(90),
                'status' => 'active',
                'is_featured' => false,
                'is_verified' => true,
                'donors_count' => 23,
                'updates' => [
                    [
                        'date' => Carbon::now()->subDays(7)->toDateString(),
                        'title' => 'Construction Site Preparation Complete',
                        'content' => 'The construction site has been prepared and the foundation work has begun. Local craftsmen are contributing their traditional building skills.'
                    ]
                ],
                'metadata' => [
                    'featured_image_alt' => 'Rendering of the proposed cultural learning center',
                    'gallery_count' => 5,
                    'verification_documents' => ['building_permit', 'architectural_plans', 'community_agreement']
                ]
            ],
            [
                'title' => 'Environmental Conservation in the Cordillera Mountains',
                'slug' => 'environmental-conservation-cordillera-mountains',
                'description' => 'Support environmental conservation efforts in the Cordillera mountains, including reforestation, wildlife protection, and sustainable resource management.',
                'full_description' => 'The Cordillera mountains are home to unique ecosystems and endangered species that need protection. This campaign supports:

1. **Reforestation Programs**: Plant native trees and restore damaged forest areas
2. **Wildlife Protection**: Establish protected areas and wildlife monitoring programs
3. **Water Conservation**: Protect watersheds and improve water management systems
4. **Sustainable Agriculture**: Promote eco-friendly farming practices
5. **Environmental Education**: Teach communities about conservation and sustainable living

The Cordillera mountains are not just beautiful; they are essential for the survival of local communities and the preservation of biodiversity. Your support will help protect this precious environment for future generations.',
                'category' => 'environment',
                'tags' => ['environment', 'conservation', 'reforestation', 'wildlife protection', 'sustainability'],
                'organizer_name' => 'Cordillera Environmental Alliance',
                'organizer_email' => 'info@cordilleraenvironment.org',
                'organizer_bio' => 'A coalition of environmental organizations working to protect the natural environment of the Cordillera region.',
                'location' => 'Cordillera Mountains',
                'target_amount' => 400000.00,
                'current_amount' => 95000.00,
                'currency' => 'PHP',
                'start_date' => Carbon::now()->subDays(60),
                'end_date' => Carbon::now()->addDays(120),
                'status' => 'active',
                'is_featured' => false,
                'is_verified' => true,
                'donors_count' => 34,
                'updates' => [
                    [
                        'date' => Carbon::now()->subDays(10)->toDateString(),
                        'title' => 'First Reforestation Site Established',
                        'content' => 'We have established our first reforestation site and planted 500 native tree seedlings. Local community members are actively participating in the program.'
                    ]
                ],
                'metadata' => [
                    'featured_image_alt' => 'Volunteers planting trees in the Cordillera mountains',
                    'gallery_count' => 7,
                    'verification_documents' => ['environmental_permits', 'conservation_plan', 'community_agreement']
                ]
            ]
        ];

        foreach ($fundraisings as $fundraisingData) {
            Fundraising::create($fundraisingData);
        }
    }
}
