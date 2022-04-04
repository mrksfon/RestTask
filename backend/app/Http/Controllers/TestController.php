<?php

namespace App\Http\Controllers;

use App\Models\AutoBid;
use App\Models\ItemBiddingHistory;
use App\Models\User;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function index()
    {
        $autoBidsForUser = AutoBid::where('user_id', 1)->where('is_active', 0)->get();

        if (count($autoBidsForUser)) {
            dd('marko');
        }

        $items = ItemBiddingHistory::where('user_id', 1)->get()->pluck('auction_item_id')->unique();

        $sum = 0;
        foreach ($items as $item) {
            $sum += ItemBiddingHistory::where('user_id', 1)->where('auction_item_id', $item)->get()->max('bid_amount');
        }

        dd($sum);

        dd($items);
    }
}
