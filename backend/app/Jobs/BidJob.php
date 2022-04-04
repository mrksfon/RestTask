<?php

namespace App\Jobs;

use App\Events\BidEvent;
use App\Models\AuctionItem;
use App\Models\AutoBid;
use App\Models\ItemBiddingHistory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;

class BidJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $userId;
    public $auctionItemId;
    public $requestType;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($userId, $auctionItemId, $requestType)
    {
        $this->userId = $userId;
        $this->auctionItemId = $auctionItemId;
        $this->requestType = $requestType;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $message = [];

        $auctionItem = AuctionItem::findOrFail($this->auctionItemId);

        if (now() >= Carbon::parse($auctionItem->auction_start)) {
            $auctionItem->update(['is_active' => false]);
            $autoBids = AutoBid::where('auction_item_id', $this->auctionItemId)->get();
            foreach ($autoBids as $bid) {
                $bid->update(['is_active' => false]);
            }
            $message = [
                'auction_end' => 'Auction for this item has ended'
            ];
        } else {
            $itemBidHistoryCurrent = ItemBiddingHistory::where('auction_item_id', $this->auctionItemId)->latest()->first();

            $flag = 0;


            if ($itemBidHistoryCurrent->user_id == $this->userId) {
                $message = [
                    'message' => 'You cant bid against yourself!',
                    'user_id' => $this->userId,
                ];
                $flag = 1;
            }



            if ($flag == 0) {

                $newBidAmount = $itemBidHistoryCurrent->bid_amount + 1;

                if ($this->requestType == 1) {
                    $hasFunds = $this->canUserAutoBid();

                    if ($hasFunds) {
                        $itemBidHistoryUser = ItemBiddingHistory::create(['auction_item_id' => $this->auctionItemId, 'user_id' => $this->userId, 'bid_amount' => $newBidAmount]);

                        $message = [
                            'item_bidding_history' => $itemBidHistoryUser,
                            'user' => $itemBidHistoryUser->user,
                            'request_type' => $this->requestType
                        ];
                    } else {
                        $user = User::find($this->userId);
                        $message = [
                            'does_not_have_funds' => 'You are exciding the limit you provided in Settings',
                            'user' => $user
                        ];
                    }
                } else {
                    $itemBidHistoryUser = ItemBiddingHistory::create(['auction_item_id' => $this->auctionItemId, 'user_id' => $this->userId, 'bid_amount' => $newBidAmount]);

                    $message = [
                        'item_bidding_history' => $itemBidHistoryUser,
                        'user' => $itemBidHistoryUser->user,
                        'request_type' => $this->requestType
                    ];
                }
            }
        }

        BidEvent::dispatch($message, $this->auctionItemId);
    }

    private function canUserAutoBid()
    {
        $user = User::findOrFail($this->userId);
        $items = ItemBiddingHistory::where('user_id', $this->userId)->get()->pluck('auction_item_id')->unique();

        $sum = 0;
        foreach ($items as $item) {
            $sum += ItemBiddingHistory::where('user_id', 1)->where('auction_item_id', $item)->get()->max('bid_amount');
        }

        $avalaibleFunds = $user->settings->maximum_bid_amount;

        if ($avalaibleFunds < $sum + 1) {
            $bids = AutoBid::where('user_id', $this->userId)->where('auction_item_id', $this->auctionItemId)->get();
            foreach ($bids as $bid) {
                $bid->update(['is_active' => 0]);
            }

            return false;
        }

        return true;
    }
}
