<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBooksAuthorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        Schema::create('books_authors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('book_id')
                ->comment("Associated book");
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->year('birth')
                ->comment("Year of birth");
            $table->year('death')
                ->nullable()
                ->comment("Year of death");
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
        Schema::dropIfExists('books_authors');
    }
}
