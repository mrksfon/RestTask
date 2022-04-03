<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemBiddingHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_bidding_history', function (Blueprint $table) {
            $table->id();
            $table->integer('bid_amount')->default(0);
            $table->integer('user_id')->default(-1);
            $table->integer('auction_item_id')->default(-1);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('item_bidding_history');
    }
}
