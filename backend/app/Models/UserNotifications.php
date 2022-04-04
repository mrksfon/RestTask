<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserNotifications extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'user_notifications';

    public $timestamps = true;

    protected $fillable = [
        'auction_item_id',
        'user_id',
        'type',
        'message',
        'sent_notification'
    ];
}
