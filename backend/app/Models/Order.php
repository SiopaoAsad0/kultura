<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'rider_id',
        'subtotal',
        'tax',
        'total',
        'status',
        'delivery_status',
        'payment_status',
        'payment_method',
        'transaction_id',
        'shipping_address',
        'billing_address',
        'notes',
        'assigned_at',
        'delivered_at',
        'delivery_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'assigned_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    /**
     * Delivery statuses (local simulation)
     */
    public const DELIVERY_UNASSIGNED = 'unassigned';
    public const DELIVERY_ASSIGNED = 'assigned';
    public const DELIVERY_PICKED_UP = 'picked_up';
    public const DELIVERY_IN_TRANSIT = 'in_transit';
    public const DELIVERY_DELIVERED = 'delivered';
    public const DELIVERY_FAILED = 'failed';

    /**
     * Order statuses
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * Payment statuses
     */
    public const PAYMENT_STATUS_UNPAID = 'unpaid';
    public const PAYMENT_STATUS_PAID = 'paid';
    public const PAYMENT_STATUS_REFUNDED = 'refunded';
    public const PAYMENT_STATUS_FAILED = 'failed';

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the rider assigned to deliver this order.
     */
    public function rider(): BelongsTo
    {
        return $this->belongsTo(Rider::class);
    }

    /**
     * Get the items for the order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Check if the order is paid.
     */
    public function isPaid(): bool
    {
        return $this->payment_status === self::PAYMENT_STATUS_PAID;
    }

    /**
     * Check if the order is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_DELIVERED;
    }

    /**
     * Get the formatted total amount.
     */
    public function getFormattedTotalAttribute(): string
    {
        return '₱' . number_format($this->total, 2);
    }

    /**
     * Scope a query to only include orders for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include orders with a specific status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
