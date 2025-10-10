<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fundraising_id',
        'amount',
        'message',
        'is_anonymous',
        'payment_method',
        'transaction_id',
        'status'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_anonymous' => 'boolean'
    ];

    /**
     * Get the user who made the donation.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the fundraising campaign.
     */
    public function fundraising()
    {
        return $this->belongsTo(Fundraising::class);
    }

    /**
     * Get the formatted amount.
     */
    public function getFormattedAmountAttribute()
    {
        return '₱' . number_format($this->amount, 2);
    }

    /**
     * Get the donor name (anonymous or real name).
     */
    public function getDonorNameAttribute()
    {
        if ($this->is_anonymous) {
            return 'Anonymous';
        }
        
        return $this->user ? $this->user->name : 'Unknown';
    }
}