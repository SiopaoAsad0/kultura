<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Imagery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'width',
        'height',
        'alt_text',
        'category',
        'tags',
        'location',
        'photographer_name',
        'photographer_email',
        'photographer_bio',
        'status',
        'is_featured',
        'is_public',
        'views_count',
        'likes_count',
        'metadata'
    ];

    protected $casts = [
        'tags' => 'array',
        'metadata' => 'array',
        'file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'is_featured' => 'boolean',
        'is_public' => 'boolean',
        'views_count' => 'integer',
        'likes_count' => 'integer'
    ];

    /**
     * Scope a query to only include active imageries.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include featured imageries.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include public imageries.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope a query to only include imageries by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to only include Cordillera imageries.
     */
    public function scopeCordillera($query)
    {
        return $query->where('category', 'cordillera');
    }

    /**
     * Get the file URL.
     */
    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }

    /**
     * Get the thumbnail URL (assuming thumbnails are stored with _thumb suffix).
     */
    public function getThumbnailUrlAttribute()
    {
        $pathInfo = pathinfo($this->file_path);
        $thumbnailPath = $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '_thumb.' . $pathInfo['extension'];
        
        return asset('storage/' . $thumbnailPath);
    }

    /**
     * Get the formatted file size.
     */
    public function getFormattedFileSizeAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get the aspect ratio.
     */
    public function getAspectRatioAttribute()
    {
        if (!$this->width || !$this->height) {
            return null;
        }
        
        $gcd = function($a, $b) use (&$gcd) {
            return $b ? $gcd($b, $a % $b) : $a;
        };
        
        $divisor = $gcd($this->width, $this->height);
        return ($this->width / $divisor) . ':' . ($this->height / $divisor);
    }

    /**
     * Check if the image is landscape.
     */
    public function isLandscape()
    {
        return $this->width > $this->height;
    }

    /**
     * Check if the image is portrait.
     */
    public function isPortrait()
    {
        return $this->height > $this->width;
    }

    /**
     * Check if the image is square.
     */
    public function isSquare()
    {
        return $this->width === $this->height;
    }
}
