<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function update(Request $request, $id)
    {
        $settings = Settings::where('user_id', $id)->get()->first();

        $request->validate([
            'user_id' => 'required',
            'maximum_bid_amount' => 'required|numeric',
            'bid_alert_notification' => 'required|numeric',
        ]);

        return $settings->update([
            'maximum_bid_amount' => $request->maximum_bid_amount,
            'bid_alert_notification' => $request->bid_alert_notification,
        ]);
    }

    public function show($id)
    {
        return Settings::where('user_id', $id)->get()->first();
    }
}
