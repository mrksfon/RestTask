<?php

namespace App\Http\Controllers;

use App\Models\ItemBiddingHistory;
use Illuminate\Http\Request;

class BidController extends Controller
{
    public function bid(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'auction_item_id' => 'required',
        ]);

        $itemBidHistoryCurrent = ItemBiddingHistory::where('auction_item_id', $request->auction_item_id)->latest()->first();

        $itemBidHistoryUser = ItemBiddingHistory::where('auction_item_id', $request->auction_item_id)->where('user_id', $request->user_id)->latest()->first();

        $newBidAmount = $itemBidHistoryCurrent->bid_amount + 1;

        if ($itemBidHistoryUser == null) {
            $itemBidHistoryUser = ItemBiddingHistory::create(['auction_item_id' => $request->auction_item_id, 'user_id' => $request->user_id, 'bid_amount' => $newBidAmount]);
            return response([
                'user_last_bid' => $itemBidHistoryUser->bid_amount,
                'auction_item_last_bid' => $itemBidHistoryUser->bid_amount
            ]);
        }




        if ($itemBidHistoryCurrent->user_id == $request->user_id) {
            return response([
                'message' => 'You cant bid against yourself!'
            ]);
        }


        $itemBidHistoryUser = ItemBiddingHistory::create(['auction_item_id' => $request->auction_item_id, 'user_id' => $request->user_id, 'bid_amount' => $newBidAmount]);

        return response([
            'user_last_bid' => $itemBidHistoryUser->bid_amount,
            'auction_item_last_bid' => $itemBidHistoryUser->bid_amount
        ]);
    }
}
