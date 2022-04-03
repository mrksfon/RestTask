<?php

namespace App\Http\Controllers;

use App\Models\AutoBid;
use Illuminate\Http\Request;

class AutoBidController extends Controller
{
    public function store(Request $request)
    {
        return AutoBid::firstOrCreate(
            ['user_id' => $request->user_id, 'auction_item_id' => $request->auction_item_id],
            ['is_active' => false]
        );
    }

    public function update(Request $request, $id)
    {
        $autoBid = AutoBid::where('user_id', $request->user_id)->where('auction_item_id', $request->auction_item_id)->get()->first();

        $isActiveNovi = !boolval($autoBid->is_active);

        $autoBid = $autoBid->update(['is_active' => $isActiveNovi]);

        $autoBid = AutoBid::where('user_id', $request->user_id)->where('auction_item_id', $request->auction_item_id)->get()->first();

        return $autoBid;
    }
}
