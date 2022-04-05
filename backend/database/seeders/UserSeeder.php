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
        $user = "user";
        $admin = "admin";

        for ($i = 0; $i < 10; $i++) {
            User::factory()->count(1)->create(['email' => $user . ($i + 1) . "@example.com", 'is_admin' => false]);
            User::factory()->count(1)->create(['email' => $admin . ($i + 1) . "@example.com", 'is_admin' => true]);
        }

        $users = User::all();

        foreach ($users as $user) {
            Settings::create(['user_id' => $user->id, 'maximum_bid_amount' => 0, 'bid_alert_notification' => 0]);
        }
    }
}
