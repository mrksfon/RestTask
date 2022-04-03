<?php


namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BidEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $auctionItemId;
    public $data;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($data, $auctionItemId)
    {
        $this->data = $data;
        $this->auctionItemId = $auctionItemId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // return new Channel('auction_item_' . $this->auctionItemId);
        return new Channel('auction_item_' . $this->auctionItemId);
    }

    public function broadcastAs()
    {
        return 'auction_item_' . $this->auctionItemId;
    }

    public function broadcastWith()
    {
        $data = $this->data;

        $data['auction_item_id'] = $this->auctionItemId;
    }
}
