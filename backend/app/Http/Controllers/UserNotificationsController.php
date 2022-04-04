<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserNotificationsController extends Controller
{
    public function index_user($id)
    {
        $user = User::findOrFail($id);

        return $user->user_notifications;
    }
}
