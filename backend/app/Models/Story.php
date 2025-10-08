<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Story extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'gallery_images',
        'category',
        'tags',
        'author_name',
        'author_email',
        'author_bio',
        'location',
        'status',
        'is_featured',
        'views_count',
        'likes_count',
        'metadata'
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'tags' => 'array',
        'metadata' => 'array',
        'is_featured' => 'boolean',
        'views_count' => 'integer',
        'likes_count' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($story) {
            if (empty($story->slug)) {
                $story->slug = Str::slug($story->title);
            }
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Scope a query to only include published stories.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope a query to only include featured stories.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include stories by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to only include Cordillera stories.
     */
    public function scopeCordillera($query)
    {
        return $query->where('category', 'cordillera');
    }

    /**
     * Get the formatted excerpt.
     */
    public function getFormattedExcerptAttribute()
    {
        return Str::limit($this->excerpt, 150);
    }

    /**
     * Get the reading time estimate.
     */
    public function getReadingTimeAttribute()
    {
        $wordCount = str_word_count(strip_tags($this->content));
        $minutes = ceil($wordCount / 200); // Average reading speed: 200 words per minute
        return $minutes . ' min read';
    }

    /**
     * Get the featured image URL.
     */
    public function getFeaturedImageUrlAttribute()
    {
        return $this->featured_image ? asset('storage/' . $this->featured_image) : null;
    }

    /**
     * Get the gallery images URLs.
     */
    public function getGalleryImageUrlsAttribute()
    {
        if (!$this->gallery_images) {
            return [];
        }

        return array_map(function($image) {
            return asset('storage/' . $image);
        }, $this->gallery_images);
    }
}
