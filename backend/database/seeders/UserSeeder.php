<?php

namespace Database\Seeders;

use App\Models\Settings;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::factory()->count(200)->create();

        foreach ($users as $user) {
            Settings::create(['user_id' => $user->id, 'maximum_bid_amount' => 0, 'bid_alert_notification' => 0]);
        }
    }
}
