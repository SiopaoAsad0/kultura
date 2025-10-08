<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Story;
use Illuminate\Support\Str;

class StorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stories = [
            [
                'title' => 'The Ancient Rice Terraces of Banaue: A Living Heritage',
                'slug' => 'ancient-rice-terraces-banaue-living-heritage',
                'excerpt' => 'Discover the magnificent rice terraces of Banaue, carved into the mountains over 2,000 years ago by the Ifugao people, representing one of the most remarkable engineering feats in human history.',
                'content' => 'The Banaue Rice Terraces, often called the "Eighth Wonder of the World," are a testament to the ingenuity and perseverance of the Ifugao people. These magnificent terraces, carved into the mountains of northern Luzon over 2,000 years ago, represent one of the most remarkable engineering feats in human history.

The terraces were built entirely by hand, using only primitive tools and the strength of the Ifugao people. They stretch for miles across the mountains, creating a stunning landscape that has captivated visitors for centuries. The terraces are not just beautiful to look at; they are also incredibly functional, providing a sustainable way to grow rice in the challenging mountain environment.

The Ifugao people developed a sophisticated irrigation system that channels water from the mountain springs down through the terraces. This system has been maintained for generations, passed down from father to son, ensuring that the terraces continue to produce rice to this day.

The cultural significance of the rice terraces goes beyond their agricultural value. They are deeply embedded in Ifugao culture and spirituality, representing the connection between the people and their environment. The terraces are considered sacred, and many rituals and ceremonies are performed to honor the spirits that protect them.

Today, the Banaue Rice Terraces face numerous challenges, including climate change, urbanization, and the migration of young people to cities. However, efforts are being made to preserve this incredible heritage for future generations. The terraces have been designated as a UNESCO World Heritage Site, and various conservation programs are working to maintain and restore them.

Visiting the rice terraces is a truly unforgettable experience. The best time to visit is during the planting season (April to May) or the harvest season (September to October), when the terraces are at their most beautiful. The terraces are accessible by road from Manila, and there are several viewpoints where visitors can take in the breathtaking scenery.

The Banaue Rice Terraces are more than just a tourist attraction; they are a living testament to the resilience and creativity of the Filipino people. They remind us of the importance of preserving our cultural heritage and the wisdom of our ancestors.',
                'category' => 'cordillera',
                'tags' => ['rice terraces', 'banaue', 'ifugao', 'heritage', 'agriculture', 'unesco'],
                'author_name' => 'Maria Santos',
                'author_email' => 'maria.santos@kultura.com',
                'author_bio' => 'Cultural heritage researcher and advocate for indigenous communities in the Cordillera region.',
                'location' => 'Banaue, Ifugao',
                'status' => 'published',
                'is_featured' => true,
                'views_count' => 1250,
                'likes_count' => 89,
                'metadata' => [
                    'reading_time' => '8 min read',
                    'featured_image_alt' => 'Aerial view of Banaue rice terraces',
                    'gallery_count' => 5
                ]
            ],
            [
                'title' => 'Traditional Weaving Techniques of the Kalinga People',
                'slug' => 'traditional-weaving-techniques-kalinga-people',
                'excerpt' => 'Explore the intricate weaving traditions of the Kalinga people, where every pattern tells a story and every thread connects the past to the present.',
                'content' => 'The Kalinga people of the Cordillera region are renowned for their exceptional weaving skills, creating some of the most beautiful and intricate textiles in the Philippines. Their traditional weaving techniques have been passed down through generations, with each pattern and design carrying deep cultural significance.

The weaving process begins with the preparation of the raw materials. The Kalinga people use locally sourced fibers, including abaca, cotton, and other natural materials. These fibers are carefully processed, spun into threads, and dyed using natural pigments derived from plants, roots, and minerals found in their environment.

The traditional Kalinga loom is a simple yet effective tool that has remained largely unchanged for centuries. It consists of a wooden frame with various components that allow the weaver to create complex patterns and designs. The weaver sits on the ground, using their body weight to maintain tension on the threads.

One of the most distinctive features of Kalinga weaving is the use of geometric patterns that represent various aspects of their culture and environment. These patterns often depict mountains, rivers, animals, and other elements of their natural surroundings. Each pattern has a specific meaning and is used in particular contexts, such as ceremonies, rituals, or everyday life.

The colors used in Kalinga textiles are also significant. Red represents courage and strength, while blue symbolizes peace and tranquility. Black is associated with the earth and stability, while white represents purity and spirituality. The combination of these colors creates a rich tapestry of meaning that reflects the values and beliefs of the Kalinga people.

The weaving process is not just a craft; it is a spiritual practice that connects the weaver to their ancestors and their cultural heritage. Many weavers say that they feel the presence of their grandmothers and great-grandmothers when they work, guiding their hands and inspiring their designs.

Today, Kalinga weaving faces the challenge of modernization and the loss of traditional knowledge. However, there are efforts to preserve and promote this ancient art form. Many young people are learning the traditional techniques, and there is a growing market for authentic Kalinga textiles both locally and internationally.

The preservation of Kalinga weaving is not just about maintaining a craft; it is about preserving a way of life and a connection to the past. These textiles are more than just beautiful objects; they are living expressions of a culture that has survived and thrived for centuries in the mountains of the Cordillera.',
                'category' => 'culture',
                'tags' => ['weaving', 'kalinga', 'textiles', 'traditional crafts', 'patterns', 'heritage'],
                'author_name' => 'Elena Bautista',
                'author_email' => 'elena.bautista@kultura.com',
                'author_bio' => 'Textile researcher and advocate for traditional weaving communities in the Cordillera region.',
                'location' => 'Tabuk, Kalinga',
                'status' => 'published',
                'is_featured' => true,
                'views_count' => 980,
                'likes_count' => 67,
                'metadata' => [
                    'reading_time' => '6 min read',
                    'featured_image_alt' => 'Kalinga woman weaving traditional textiles',
                    'gallery_count' => 8
                ]
            ],
            [
                'title' => 'The Sacred Rituals of the Cordillera: Connecting with Ancestors',
                'slug' => 'sacred-rituals-cordillera-connecting-ancestors',
                'excerpt' => 'Delve into the spiritual practices and sacred rituals of the Cordillera people, where ancient traditions continue to guide daily life and community bonds.',
                'content' => 'The Cordillera region is home to some of the most ancient and profound spiritual traditions in the Philippines. These sacred rituals, passed down through countless generations, continue to play a vital role in the daily lives of the indigenous communities, connecting them to their ancestors and the natural world around them.

One of the most important aspects of Cordillera spirituality is the belief in the presence of ancestral spirits. These spirits are not seen as distant or removed from daily life, but as active participants in the community\'s affairs. They are consulted for guidance, protection, and blessings, and their presence is felt in every aspect of life.

The cañao is perhaps the most well-known ritual in the Cordillera region. This elaborate ceremony involves the sacrifice of animals, usually pigs or chickens, as offerings to the ancestral spirits. The cañao is performed for various reasons: to celebrate important life events, to seek protection from harm, to ensure a good harvest, or to honor the dead.

The ritual begins with the selection of the sacrificial animal, which must be healthy and unblemished. The animal is then blessed by the community\'s spiritual leader, who recites prayers and invocations to the ancestral spirits. The sacrifice is performed with great reverence, and every part of the animal is used, with nothing going to waste.

After the sacrifice, the community gathers for a feast, sharing the meat and other offerings. This communal meal is not just about nourishment; it is a way of strengthening the bonds between community members and between the living and the dead. The feast is accompanied by traditional music, dancing, and storytelling, creating a powerful sense of unity and connection.

Another important ritual is the blessing of new homes and buildings. Before a new structure is occupied, it must be blessed by the community\'s spiritual leader. This blessing ensures that the building will be protected from evil spirits and that it will bring good fortune to its occupants.

The ritual involves the burning of incense, the recitation of prayers, and the sprinkling of holy water or rice wine. The spiritual leader walks through every room of the building, blessing each space and asking for protection and prosperity. This ritual is not just a formality; it is a deeply meaningful act that connects the new building to the spiritual world.

The preservation of these sacred rituals is crucial for maintaining the cultural identity of the Cordillera people. However, these traditions face challenges from modernization, Christianity, and the migration of young people to cities. Many communities are working to preserve these rituals by teaching them to younger generations and adapting them to contemporary life.

The sacred rituals of the Cordillera are more than just religious practices; they are living expressions of a culture that has survived and thrived for centuries. They remind us of the importance of maintaining our connection to our ancestors and the natural world, and they offer valuable lessons about community, spirituality, and the human experience.',
                'category' => 'heritage',
                'tags' => ['rituals', 'spirituality', 'ancestors', 'cañao', 'traditions', 'ceremonies'],
                'author_name' => 'Dr. Roberto Mendoza',
                'author_email' => 'roberto.mendoza@kultura.com',
                'author_bio' => 'Anthropologist specializing in indigenous spiritual practices and cultural preservation.',
                'location' => 'Bontoc, Mountain Province',
                'status' => 'published',
                'is_featured' => false,
                'views_count' => 756,
                'likes_count' => 45,
                'metadata' => [
                    'reading_time' => '7 min read',
                    'featured_image_alt' => 'Traditional cañao ceremony in the Cordillera',
                    'gallery_count' => 6
                ]
            ],
            [
                'title' => 'Sustainable Agriculture in the Cordillera: Lessons from the Mountains',
                'slug' => 'sustainable-agriculture-cordillera-lessons-mountains',
                'excerpt' => 'Learn about the innovative agricultural practices of the Cordillera people, who have developed sustainable farming methods that work in harmony with nature.',
                'content' => 'The Cordillera region presents unique challenges for agriculture, with its steep mountains, limited arable land, and unpredictable weather patterns. However, the indigenous people of the region have developed innovative and sustainable farming practices that not only overcome these challenges but also work in harmony with the natural environment.

One of the most remarkable examples of sustainable agriculture in the Cordillera is the rice terrace system. These terraces, built over centuries, represent a sophisticated understanding of water management, soil conservation, and ecosystem balance. The terraces prevent soil erosion, conserve water, and create microclimates that support diverse plant and animal life.

The traditional farming calendar of the Cordillera people is based on careful observation of natural cycles and weather patterns. Farmers plant crops at specific times based on the position of the stars, the behavior of animals, and the appearance of certain plants. This traditional knowledge, passed down through generations, has proven to be remarkably accurate and effective.

Crop rotation is another important practice in Cordillera agriculture. Farmers alternate between different crops to maintain soil fertility and prevent the buildup of pests and diseases. This practice not only improves crop yields but also promotes biodiversity and ecosystem health.

The use of organic fertilizers is also common in the Cordillera. Farmers use compost, animal manure, and other natural materials to enrich the soil. They avoid chemical fertilizers and pesticides, preferring natural methods that are safer for both the environment and human health.

Water management is crucial in the Cordillera, where water is often scarce and must be carefully conserved. The traditional irrigation systems used in the rice terraces are designed to distribute water evenly and efficiently. These systems use gravity to move water from mountain springs down through the terraces, requiring no external energy source.

The preservation of traditional agricultural knowledge is essential for the future of sustainable farming in the Cordillera. However, this knowledge is at risk of being lost as younger generations migrate to cities and adopt modern farming practices. There is a growing recognition of the value of traditional knowledge, and efforts are being made to document and preserve it.

Modern agricultural research is beginning to recognize the wisdom of traditional practices. Scientists are studying the rice terrace system and other traditional farming methods to understand how they work and how they can be applied to modern agriculture. This research is helping to bridge the gap between traditional and modern farming practices.

The sustainable agriculture practices of the Cordillera people offer valuable lessons for the rest of the world. They demonstrate that it is possible to produce food in harmony with nature, using methods that are both effective and environmentally friendly. These practices remind us of the importance of respecting and learning from traditional knowledge and the wisdom of indigenous communities.',
                'category' => 'environment',
                'tags' => ['agriculture', 'sustainability', 'rice terraces', 'traditional farming', 'environment', 'conservation'],
                'author_name' => 'Ana Dela Cruz',
                'author_email' => 'ana.delacruz@kultura.com',
                'author_bio' => 'Agricultural researcher and advocate for sustainable farming practices in the Cordillera region.',
                'location' => 'Sagada, Mountain Province',
                'status' => 'published',
                'is_featured' => false,
                'views_count' => 623,
                'likes_count' => 34,
                'metadata' => [
                    'reading_time' => '5 min read',
                    'featured_image_alt' => 'Traditional farming practices in the Cordillera mountains',
                    'gallery_count' => 4
                ]
            ],
            [
                'title' => 'The Art of Traditional Tattooing in the Cordillera',
                'slug' => 'art-traditional-tattooing-cordillera',
                'excerpt' => 'Discover the ancient art of traditional tattooing in the Cordillera, where every mark tells a story of courage, identity, and cultural heritage.',
                'content' => 'Traditional tattooing in the Cordillera region is more than just body art; it is a sacred practice that connects individuals to their ancestors, their community, and their cultural identity. This ancient art form, known as "batok" in the local language, has been practiced for centuries and continues to hold deep significance for the indigenous people of the region.

The traditional tattooing process is a complex and spiritual ritual that involves not just the application of ink to skin, but also prayers, blessings, and the invocation of ancestral spirits. The tattoo artist, known as a "mambabatok," is not just a craftsman but a spiritual guide who helps the recipient connect with their cultural heritage.

The tools used in traditional tattooing are simple yet effective. A sharpened piece of wood or bone is used to puncture the skin, and natural ink made from soot and other organic materials is applied to create the designs. The process is painful and requires great courage, which is why tattoos are often seen as symbols of strength and bravery.

The designs used in traditional tattooing are not arbitrary; each pattern has a specific meaning and significance. Some designs represent protection from evil spirits, while others symbolize achievements, status, or personal experiences. The placement of tattoos on the body is also significant, with different areas representing different aspects of life and identity.

For men, tattoos often represent their achievements in battle, hunting, or other masculine pursuits. Women\'s tattoos, on the other hand, often represent their skills in weaving, their beauty, or their role in the community. The designs are passed down through generations, with each family having its own unique patterns and meanings.

The traditional tattooing process is a community event, with family members and friends gathering to support the recipient. The ritual often includes feasting, music, and dancing, creating a powerful sense of community and connection. The tattoo is not just a personal decoration but a way of strengthening the bonds between community members.

Today, traditional tattooing in the Cordillera faces challenges from modernization and the influence of Western culture. Many young people are choosing modern tattoo styles over traditional ones, and the knowledge of traditional tattooing is at risk of being lost. However, there are efforts to preserve and promote this ancient art form.

Some traditional tattoo artists are teaching their skills to younger generations, and there is a growing interest in traditional tattooing among both locals and tourists. The art form is being recognized as an important part of the cultural heritage of the Cordillera region, and efforts are being made to document and preserve it.

The preservation of traditional tattooing is not just about maintaining an art form; it is about preserving a way of life and a connection to the past. These tattoos are more than just decorations; they are living expressions of a culture that has survived and thrived for centuries in the mountains of the Cordillera.',
                'category' => 'culture',
                'tags' => ['tattooing', 'batok', 'traditional art', 'spirituality', 'identity', 'heritage'],
                'author_name' => 'Carlos Reyes',
                'author_email' => 'carlos.reyes@kultura.com',
                'author_bio' => 'Cultural anthropologist and researcher of traditional arts in the Cordillera region.',
                'location' => 'Buscalan, Kalinga',
                'status' => 'published',
                'is_featured' => true,
                'views_count' => 892,
                'likes_count' => 56,
                'metadata' => [
                    'reading_time' => '6 min read',
                    'featured_image_alt' => 'Traditional tattooing ceremony in the Cordillera',
                    'gallery_count' => 7
                ]
            ]
        ];

        foreach ($stories as $storyData) {
            Story::create($storyData);
        }
    }
}
