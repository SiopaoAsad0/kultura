<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'vehicle_type',
        'plate_number',
        'status',
    ];

    public const STATUS_AVAILABLE = 'available';
    public const STATUS_ON_DELIVERY = 'on_delivery';
    public const STATUS_OFFLINE = 'offline';

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
