<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuctionItem extends Model
{
    use HasFactory;

    protected $table = 'auction_items';

    protected $fillable = [
        'name',
        'description',
        'auction_start',
        'duration'
    ];
}
