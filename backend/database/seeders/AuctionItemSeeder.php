<?php

namespace Database\Seeders;

use App\Models\AuctionItem;
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
        AuctionItem::factory()->count(200)->create();
    }
}
