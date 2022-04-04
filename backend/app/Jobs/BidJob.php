<?php

namespace App\Jobs;

use App\Events\BidEvent;
use App\Events\NotificationEvent;
use App\Models\AuctionItem;
use App\Models\AutoBid;
use App\Models\ItemBiddingHistory;
use App\Models\User;
use App\Models\UserNotifications;
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
            $user = User::findOrFail($this->userId);

            $latestItem = ItemBiddingHistory::where('auction_item_id', $this->auctionItemId)->latest()->first();

            $newAmount = $user->account - $latestItem->bid_amount;

            $user->update(['account' => $newAmount]);


            $autoBids = AutoBid::where('auction_item_id', $this->auctionItemId)->get();
            foreach ($autoBids as $bid) {
                $bid->update(['is_active' => false]);
            }
            $message = [
                'auction_end' => 'Auction for this item has ended'
            ];

            $items = ItemBiddingHistory::where('auction_item_id', $this->auctionItemId)->where('user_id', '!=', -1)->get()->pluck('user_id')->unique();

            $messageAuctionOver = "The auction for the item " . $auctionItem->name . "IS OVER";

            foreach ($items as $item) {
                $notification = UserNotifications::where('user_id', $item)->where('auction_item_id', $this->auctionItemId)->where('type', 2)->get()->first();

                if ($notification == null) {
                    $notification = UserNotifications::create([
                        'user_id' => $item,
                        'auction_item_id' => $this->auctionItemId,
                        'type' => 2,
                        'sent_notification' => 1,
                        'message' => $messageAuctionOver
                    ]);
                    NotificationEvent::dispatch($message, $item, $notification);
                } else {
                    if ($notification->sent_notification == 0) {
                        $notification->update([
                            'user_id' => $item,
                            'auction_item_id' => $this->auctionItemId,
                            'type' => 2,
                            'sent_notification' => 1,
                            'message' => $messageAuctionOver
                        ]);
                        NotificationEvent::dispatch($message, $item, $notification);
                    }
                }
            }
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

                    $user = User::findOrFail($this->userId);
                    $items = ItemBiddingHistory::where('user_id', $this->userId)->get()->pluck('auction_item_id')->unique();

                    $auctionItems = AuctionItem::where('is_active', 0)->whereIn('id', $items)->get()->pluck('id');

                    $sum = 0;
                    foreach ($auctionItems as $item) {
                        $sum += ItemBiddingHistory::where('user_id', $this->userId)->where('auction_item_id', $item)->get()->max('bid_amount');
                    }

                    if ($user->account <= $sum) {
                        $message = [
                            'not_enough_funds' => 'You currently do not have enought funds on your account.'
                        ];
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
        }

        BidEvent::dispatch($message, $this->auctionItemId);
    }

    private function canUserAutoBid()
    {
        $user = User::findOrFail($this->userId);
        $items = ItemBiddingHistory::where('user_id', $this->userId)->get()->pluck('auction_item_id')->unique();

        $auctionItems = AuctionItem::where('is_active', true)->whereIn('id', $items)->get()->pluck('id');

        $sum = 0;
        foreach ($auctionItems as $item) {
            $sum += ItemBiddingHistory::where('user_id', $this->userId)->where('auction_item_id', $item)->get()->max('bid_amount');
        }

        $avalaibleFunds = $user->settings->maximum_bid_amount;

        if ($avalaibleFunds <= $sum + 1) {
            $bids = AutoBid::where('user_id', $this->userId)->where('auction_item_id', $this->auctionItemId)->get();
            foreach ($bids as $bid) {
                $bid->update(['is_active' => 0]);
            }

            return false;
        }

        $calculatedBid = ceil(($user->settings->bid_alert_notification / 100) * $user->settings->maximum_bid_amount);

        if ($sum >= $calculatedBid) {
            $notification = UserNotifications::where('user_id', $this->userId)->where('auction_item_id', $this->auctionItemId)->where('type', 1)->get()->first();

            $auctionItem = AuctionItem::findOrFail($this->auctionItemId);

            $message = "You have crossed the limit of " . $user->settings->bid_alert_notification . "% for " . $auctionItem->name;

            if ($notification == null) {
                $notification = UserNotifications::create([
                    'user_id' => $this->userId,
                    'auction_item_id' => $this->auctionItemId,
                    'type' => 1,
                    'sent_notification' => 1,
                    'message' => $message
                ]);
                NotificationEvent::dispatch($message, $this->userId, $notification);
            } else {
                if ($notification->sent_notification == 0) {
                    $notification->update([
                        'user_id' => $this->userId,
                        'auction_item_id' => $this->auctionItemId,
                        'type' => 1,
                        'sent_notification' => 1,
                        'message' => $message
                    ]);
                    NotificationEvent::dispatch($message, $this->userId, $notification);
                }
            }
        }
        return true;
    }
}
