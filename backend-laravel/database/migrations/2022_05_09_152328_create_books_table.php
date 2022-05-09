<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('edithor')->comment("Publisher name");
            $table->string('edition')->comment("Edition Name");
            $table->date('publishing')->comment("Publication date");
            $table->decimal('cost', $precision = 10, $scale = 2)
                ->default(0)
                ->comment("Purchase cost");
            $table->decimal('amount', $precision = 10, $scale = 2)
                ->default(0)
                ->comment("Suggested retail price");
            $table->enum('rating', ['extraordinary', 'excellent', 'good', 'damaged']);
            $table->string('rating_notes', 100)
                ->nullable()
                ->comment("Optional Valuation Notes");
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('books');
    }
}
