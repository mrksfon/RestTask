<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Settings extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'settings';
    public $timestamps = true;
    protected $fillable = [
        'user_id',
        'maximum_bid_amount',
        'bid_alert_notification',
    ];
}
