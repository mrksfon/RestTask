<?php

namespace App\Http\Controllers;

use App\Models\AuctionItem;
use Illuminate\Http\Request;

class AuctionItemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return AuctionItem::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'auction_start' => 'required',
        ]);

        return AuctionItem::create([
            'name' => $request->name,
            'description' => $request->description,
            'auction_start' => $request->auction_start,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return AuctionItem::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $auctionItem = AuctionItem::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'auction_start' => 'required',
        ]);

        return $auctionItem->update([
            'name' => $request->name,
            'description' => $request->description,
            'auction_start' => $request->auction_start,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return AuctionItem::destroy($id);
    }
}
