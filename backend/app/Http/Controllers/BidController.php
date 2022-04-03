<?php

namespace App\Http\Controllers;

use App\Jobs\BidJob;
use App\Models\ItemBiddingHistory;
use Illuminate\Http\Request;

class BidController extends Controller
{
    public function bid(Request $request)
    {
        dispatch(new BidJob($request->user_id, $request->auction_item_id));
    }
}
