<?php

namespace App\Models;

use Attribute;
use Carbon\Carbon;
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
    ];
    protected $appends = ['formatted_date'];

    public function getFormattedDateAttribute()
    {
        return Carbon::parse($this->auction_start)->format('Y-m-d\TH:i');
    }
}
