<?php

namespace App\Http\Controllers;

use App\Models\ItemBiddingHistory;
use Illuminate\Http\Request;

class ItemBiddingHistoryController extends Controller
{
    public function show($id, $user_id)
    {
        $itemBidHistoryLatest = ItemBiddingHistory::where('auction_item_id', $id)->latest()->first();

        $itemBidHistoryUserLatest = ItemBiddingHistory::where('auction_item_id', $id)->where('user_id', $user_id)->latest()->first();

        $userLastBid = 0;

        if ($itemBidHistoryUserLatest != null) {
            $userLastBid = $itemBidHistoryUserLatest->bid_amount;
        }

        return response([
            'user_last_bid' => $userLastBid,
            'auction_item_last_bid' => $itemBidHistoryLatest->bid_amount
        ]);
    }
}
