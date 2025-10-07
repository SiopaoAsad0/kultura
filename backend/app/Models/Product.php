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
        'image'
    ];

    // Relation to weaver
    public function weaver()
    {
        return $this->belongsTo(User::class, 'weaver_id');
    }
}
