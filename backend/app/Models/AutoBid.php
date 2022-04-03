<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AutoBid extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'auto_bid';

    protected $fillable = [
        'user_id',
        'auction_item_id',
        'is_active',
    ];
}
