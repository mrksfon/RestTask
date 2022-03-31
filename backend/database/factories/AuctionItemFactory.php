<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AuctionItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'description' => $this->faker->words(15, true),
            'auction_start' => $this->faker->dateTimeBetween(now(), now()->addDays(4)),
        ];
    }
}
