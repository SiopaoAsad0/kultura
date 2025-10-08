<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Fundraising extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'full_description',
        'featured_image',
        'gallery_images',
        'category',
        'tags',
        'organizer_name',
        'organizer_email',
        'organizer_bio',
        'location',
        'target_amount',
        'current_amount',
        'currency',
        'start_date',
        'end_date',
        'status',
        'is_featured',
        'is_verified',
        'donors_count',
        'updates',
        'metadata'
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'tags' => 'array',
        'updates' => 'array',
        'metadata' => 'array',
        'target_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_featured' => 'boolean',
        'is_verified' => 'boolean',
        'donors_count' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($fundraising) {
            if (empty($fundraising->slug)) {
                $fundraising->slug = Str::slug($fundraising->title);
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
     * Scope a query to only include active fundraisings.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include featured fundraisings.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include verified fundraisings.
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope a query to only include fundraisings by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to only include Cordillera fundraisings.
     */
    public function scopeCordillera($query)
    {
        return $query->where('category', 'cordillera');
    }

    /**
     * Get the progress percentage.
     */
    public function getProgressPercentageAttribute()
    {
        if ($this->target_amount <= 0) {
            return 0;
        }
        
        return min(100, round(($this->current_amount / $this->target_amount) * 100, 2));
    }

    /**
     * Get the formatted target amount.
     */
    public function getFormattedTargetAmountAttribute()
    {
        return '₱' . number_format($this->target_amount, 2);
    }

    /**
     * Get the formatted current amount.
     */
    public function getFormattedCurrentAmountAttribute()
    {
        return '₱' . number_format($this->current_amount, 2);
    }

    /**
     * Get the remaining amount.
     */
    public function getRemainingAmountAttribute()
    {
        return max(0, $this->target_amount - $this->current_amount);
    }

    /**
     * Get the formatted remaining amount.
     */
    public function getFormattedRemainingAmountAttribute()
    {
        return '₱' . number_format($this->remaining_amount, 2);
    }

    /**
     * Get the days remaining.
     */
    public function getDaysRemainingAttribute()
    {
        $now = now();
        $endDate = $this->end_date;
        
        if ($endDate <= $now) {
            return 0;
        }
        
        return $now->diffInDays($endDate);
    }

    /**
     * Check if the fundraising is active.
     */
    public function isActive()
    {
        return $this->status === 'active' && 
               $this->start_date <= now() && 
               $this->end_date >= now();
    }

    /**
     * Check if the fundraising is completed.
     */
    public function isCompleted()
    {
        return $this->current_amount >= $this->target_amount || 
               $this->end_date < now();
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
