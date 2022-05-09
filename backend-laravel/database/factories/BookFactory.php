<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'title' => $this->faker->company(),
            'edithor' => $this->faker->name(),
            'edition' => $this->faker->randomDigit(),
            'publishing' => $this->faker->date(),
            'cost' => $this->faker->randomFloat(2, 10, 500),
            'amount' => $this->faker->randomFloat(2, 10, 500),
            'rating' => $this->faker->randomElement(['extraordinary', 'excellent', 'good', 'damaged']),
            'rating_notes' => $this->faker->sentence($nbWords = 3, $variableNbWords = true),
        ];
    }
}
