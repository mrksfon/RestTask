<?php

namespace App\Jobs;

use App\Events\BidEvent;
use App\Models\ItemBiddingHistory;
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
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($userId, $auctionItemId)
    {
        $this->userId = $userId;
        $this->auctionItemId = $auctionItemId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $message = [];

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

            $itemBidHistoryUser = ItemBiddingHistory::create(['auction_item_id' => $this->auctionItemId, 'user_id' => $this->userId, 'bid_amount' => $newBidAmount]);

            $message = [
                'item_bidding_history' => $itemBidHistoryUser,
                'user' => $itemBidHistoryUser->user,
            ];
        }

        BidEvent::dispatch($message, $this->auctionItemId);
    }
}
