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
        $latestItem = ItemBiddingHistory::where('auction_item_id', 8)->latest()->first();

        $user = User::findOrFail(28);

        $newAMount = $user->account - $latestItem->bid_amount;


        $user->update(['account' => $newAMount]);

        dd($user);
    }
}
