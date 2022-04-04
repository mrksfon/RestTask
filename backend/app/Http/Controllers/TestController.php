<?php

namespace App\Http\Controllers;

use App\Models\AuctionItem;
use App\Models\AutoBid;
use App\Models\ItemBiddingHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TestController extends Controller
{
    public function index()
    {
        $item = AuctionItem::findOrFail(1);

        dd(now() >= Carbon::parse($item->auction_start));
    }
}
