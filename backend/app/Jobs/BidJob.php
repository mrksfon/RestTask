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
    public $message;
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
        $this->message = [];
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
            // auction is over
            $this->handleAuctionEnd($auctionItem);
        } else {
            $itemBidHistoryCurrent = ItemBiddingHistory::where('auction_item_id', $this->auctionItemId)->latest()->first();

            $userCanBid = $this->handleUserCanBid($itemBidHistoryCurrent);

            if ($userCanBid) {

                $newBidAmount = $itemBidHistoryCurrent->bid_amount + 1;

                if ($this->requestType == 1) {
                    $hasFunds = $this->canUserAutoBid();

                    $this->setMessageForAutoBidding($hasFunds, $newBidAmount);
                } else {

                    $user = User::findOrFail($this->userId);

                    $sum = $this->calculateAllReservedFunds();

                    $this->setMessageForBid($user, $sum, $newBidAmount);
                }
            }
        }

        BidEvent::dispatch($this->message, $this->auctionItemId);
    }

    private function canUserAutoBid()
    {
        $user = User::findOrFail($this->userId);
        $auctionItem = AuctionItem::findOrFail($this->auctionItemId);
        $sum = $this->calculateAllReservedFunds();

        $avalaibleFunds = $user->settings->maximum_bid_amount;

        if ($avalaibleFunds <= $sum + 1) {
            $bids = AutoBid::where('user_id', $this->userId)->where('auction_item_id', $this->auctionItemId)->get();
            foreach ($bids as $bid) {
                $bid->update(['is_active' => 0]);
            }

            return false;
        }

        $calculatedBid = ceil(($user->settings->bid_alert_notification / 100) * $user->settings->maximum_bid_amount);
        $messageForUser = "You have crossed the limit of " . $user->settings->bid_alert_notification . " (%) for item " . $auctionItem->name;

        if ($sum >= $calculatedBid) {
            $this->notifyUser($user->id, $messageForUser, $this->message);
        }
        return true;
    }

    private function handleAuctionEnd($auctionItem)
    {
        $auctionItem->update(['is_active' => false]);
        $user = User::findOrFail($this->userId);

        $latestItem = ItemBiddingHistory::where('auction_item_id', $this->auctionItemId)->latest()->first();

        $newAmount = $user->account - $latestItem->bid_amount;

        $user->update(['account' => $newAmount]);


        $this->disableAutoBids();
        $this->message = [
            'auction_end' => 'Auction for this item has ended'
        ];

        $usersId = ItemBiddingHistory::where('auction_item_id', $this->auctionItemId)->where('user_id', '!=', -1)->get()->pluck('user_id')->unique();

        $messageForUser = "The auction for the item " . $auctionItem->name . "IS OVER";

        foreach ($usersId as $userId) {
            $this->notifyUser($userId, $messageForUser, $this->message);
        }
    }

    private function notifyUser($userId, $messageForUser, $message)
    {
        $notification = UserNotifications::where('user_id', $userId)->where('auction_item_id', $this->auctionItemId)->where('type', $this->requestType)->get()->first();

        if ($notification == null) {
            $notification = UserNotifications::create([
                'user_id' => $userId,
                'auction_item_id' => $this->auctionItemId,
                'type' => $this->requestType,
                'sent_notification' => 1,
                'message' => $messageForUser
            ]);
            NotificationEvent::dispatch($message, $userId, $notification);
        } else {
            if ($notification->sent_notification == 0) {
                $notification->update([
                    'user_id' => $userId,
                    'auction_item_id' => $this->auctionItemId,
                    'type' => $this->requestType,
                    'sent_notification' => 1,
                    'message' => $messageForUser
                ]);
                NotificationEvent::dispatch($message, $userId, $notification);
            }
        }
    }

    private function disableAutoBids()
    {
        $autoBids = AutoBid::where('auction_item_id', $this->auctionItemId)->get();
        foreach ($autoBids as $bid) {
            $bid->update(['is_active' => false]);
        }
    }

    private function handleUserCanBid($itemBidHistoryCurrent)
    {
        if ($itemBidHistoryCurrent->user_id == $this->userId) {
            $this->message = [
                'message' => 'You cant bid against yourself!',
                'user_id' => $this->userId,
            ];
            return false;
        }
        return true;
    }

    private function setMessageForAutoBidding($hasFunds, $newBidAmount)
    {
        if ($hasFunds) {
            $itemBidHistoryUser = ItemBiddingHistory::create(['auction_item_id' => $this->auctionItemId, 'user_id' => $this->userId, 'bid_amount' => $newBidAmount]);

            $this->message = [
                'item_bidding_history' => $itemBidHistoryUser,
                'user' => $itemBidHistoryUser->user,
                'request_type' => $this->requestType
            ];
        } else {
            $user = User::find($this->userId);
            $this->message = [
                'does_not_have_funds' => 'You are exciding the limit you provided in Settings',
                'user' => $user
            ];
        }
    }

    private function calculateAllReservedFunds()
    {
        $items = ItemBiddingHistory::where('user_id', $this->userId)->get()->pluck('auction_item_id')->unique();

        $auctionItems = AuctionItem::where('is_active', true)->whereIn('id', $items)->get()->pluck('id');

        $sum = 0;
        foreach ($auctionItems as $item) {
            $sum += ItemBiddingHistory::where('user_id', $this->userId)->where('auction_item_id', $item)->get()->max('bid_amount');
        }

        return $sum;
    }

    public function setMessageForBid($user, $sum, $newBidAmount)
    {
        if ($user->account <= $sum) {
            $this->message = [
                'not_enough_funds' => 'You currently do not have enought funds on your account.'
            ];
        } else {
            $itemBidHistoryUser = ItemBiddingHistory::create(['auction_item_id' => $this->auctionItemId, 'user_id' => $this->userId, 'bid_amount' => $newBidAmount]);

            $this->message = [
                'item_bidding_history' => $itemBidHistoryUser,
                'user' => $itemBidHistoryUser->user,
                'request_type' => $this->requestType
            ];
        }
    }
}
