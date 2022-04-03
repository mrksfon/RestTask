<?php

namespace Database\Seeders;

use App\Models\AuctionItem;
use App\Models\ItemBiddingHistory;
use Illuminate\Database\Seeder;

class AuctionItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $auctionItems = AuctionItem::factory()->count(200)->create();

        foreach ($auctionItems as $item) {
            ItemBiddingHistory::create(['auction_item_id' => $item->id]);
        }
    }
}
