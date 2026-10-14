<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'story',
        'stock',
        'price',
        'weaver_id',
        'cultural_category_id',
        'heritage_origin',
        'materials_used',
        'cultural_significance',
        'crafting_technique',
        'crafting_time_hours',
        'artisan_story',
        'cultural_images',
        'is_handmade',
        'is_fair_trade',
        'supports_artisan',
        'image_url',
        'created_at',
        'updated_at'
    ];
    
    protected $appends = ['formatted_price', 'is_available', 'cultural_gallery'];
    
    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'crafting_time_hours' => 'integer',
        'is_handmade' => 'boolean',
        'is_fair_trade' => 'boolean',
        'supports_artisan' => 'boolean',
        'cultural_images' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the cultural category that owns the product.
     */
    public function culturalCategory()
    {
        return $this->belongsTo(CulturalCategory::class);
    }
    
    /**
     * Get the artisan/weaver who created the product.
     */
    public function artisan()
    {
        return $this->belongsTo(User::class, 'weaver_id');
    }
    
    /**
     * Get the cultural gallery images.
     */
    public function getCulturalGalleryAttribute()
    {
        if (empty($this->cultural_images)) {
            return [];
        }
        
        return array_map(function($image) {
            return asset('storage/' . $image);
        }, $this->cultural_images);
    }
    
    /**
     * Get the crafting time in a human-readable format.
     */
    public function getCraftingTimeAttribute()
    {
        if ($this->crafting_time_hours >= 24) {
            $days = floor($this->crafting_time_hours / 24);
            return $days . ' ' . str_plural('day', $days);
        }
        return $this->crafting_time_hours . ' ' . str_plural('hour', $this->crafting_time_hours);
    }
    
    /**
     * Check if the product is available for purchase.
     */
    public function getIsAvailableAttribute()
    {
        return $this->stock > 0;
    }
    
    /**
     * Scope a query to only include products from a specific cultural origin.
     */
    public function scopeFromOrigin($query, $origin)
    {
        return $query->where('heritage_origin', $origin);
    }
    
    /**
     * Scope a query to only include handmade products.
     */
    public function scopeHandmade($query)
    {
        return $query->where('is_handmade', true);
    }
    
    /**
     * Scope a query to only include fair trade products.
     */
    public function scopeFairTrade($query)
    {
        return $query->where('is_fair_trade', true);
    }
    
    /**
     * Scope a query to only include products that support artisans.
     */
    public function scopeSupportsArtisan($query)
    {
        return $query->where('supports_artisan', true);
    }

    /**
     * Get the weaver that owns the product.
     */
    public function weaver()
    {
        return $this->belongsTo(User::class, 'weaver_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Scope a query to only include available products.
     */
    public function scopeAvailable($query)
    {
        return $query->where('stock', '>', 0);
    }

    /**
     * Check if the product is in stock.
     */
    public function isInStock(): bool
    {
        return $this->stock > 0;
    }

    /**
     * Get the formatted price attribute.
     */
    public function getFormattedPriceAttribute(): string
    {
        return '₱' . number_format($this->price, 2);
    }

    /**
     * Get the image URL with fallback to a default image.
     */
    public function getImageUrlAttribute($value)
    {
        return $value ?: asset('images/default-product.jpg');
    }
}
