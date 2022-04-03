<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ItemBiddingHistory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'item_bidding_history';
    public $timestamps = true;

    protected $with = ['user'];

    protected $fillable = [
        'auction_item_id',
        'user_id',
        'bid_amount',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
