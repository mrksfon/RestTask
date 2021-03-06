<?php

use App\Http\Controllers\AuctionItemController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AutoBidController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\ItemBiddingHistoryController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserNotificationsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/item_bidding_history/{id}/{user_id}', [ItemBiddingHistoryController::class, 'show']);
    Route::get('/item_bidding_history/{id}', [ItemBiddingHistoryController::class, 'index']);
    Route::get('/auction_items', [AuctionItemController::class, 'index']);
    Route::get('/auction_items/{id}', [AuctionItemController::class, 'show']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/bid', [BidController::class, 'bid']);
    Route::get('/settings/users/{id}', [SettingsController::class, 'show']);
    Route::post('/settings/{id}', [SettingsController::class, 'update']);
    Route::post('/auto_bid', [AutoBidController::class, 'store']);
    Route::post('/auto_bid/users/{id}', [AutoBidController::class, 'update']);
    Route::get('/notifications/{id}', [UserNotificationsController::class, 'index_user']);



    Route::group(['middleware' => ['admin']], function () {
        Route::post('/auction_items', [AuctionItemController::class, 'store']);
        Route::put('/auction_items/{id}', [AuctionItemController::class, 'update']);
        Route::delete('/auction_items/{id}', [AuctionItemController::class, 'destroy']);
    });
});
