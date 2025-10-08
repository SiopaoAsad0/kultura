<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CulturalCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'heritage_origin',
        'materials_used',
        'traditional_technique',
        'crafting_time_days',
        'skill_level',
        'is_endangered',
        'icon',
        'banner_image'
    ];

    protected $casts = [
        'is_endangered' => 'boolean',
        'crafting_time_days' => 'integer'
    ];

    /**
     * Get the products for this category.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Scope a query to only include endangered crafts.
     */
    public function scopeEndangered($query)
    {
        return $query->where('is_endangered', true);
    }

    /**
     * Get the crafting time as a human-readable string.
     */
    public function getCraftingTimeAttribute(): string
    {
        if ($this->crafting_time_days >= 30) {
            $months = floor($this->crafting_time_days / 30);
            return $months . ' ' . str_plural('month', $months);
        }
        return $this->crafting_time_days . ' ' . str_plural('day', $this->crafting_time_days);
    }
}
