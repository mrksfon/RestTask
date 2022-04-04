<?php

namespace App\Http\Controllers;

use App\Models\AuctionItem;
use App\Models\AutoBid;
use App\Models\ItemBiddingHistory;
use App\Models\User;
use App\Models\UserNotifications;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TestController extends Controller
{
    public function index()
    {
        $user = User::findOrFail(1);

        for ($i = 0; $i < 3; $i++) {
            $notification = UserNotifications::where('user_id', 1)->where('auction_item_id', 1)->where('type', 1)->get()->first();

            $message = "You have crossed the limit of " . $user->settings->bid_alert_notification . "%";

            $tekst = "";

            if ($notification == null) {
                UserNotifications::create([
                    'user_id' => 1,
                    'auction_item_id' => 1,
                    'type' => 1,
                    'sent_notification' => 1,
                    'message' => $message
                ]);
                // NotificationEvent::dispatch($message, $this->userId);
            } else {

                if ($notification->sent_notification == 0) {
                    dd('ulazi ovde sad sta ne razumem', $i);
                    $notification->update([
                        'user_id' => 1,
                        'auction_item_id' => 1,
                        'type' => 1,
                        'sent_notification' => 1,
                        'message' => $message
                    ]);
                    // NotificationEvent::dispatch($message, $this->userId);
                }
            }
        }
    }
}
