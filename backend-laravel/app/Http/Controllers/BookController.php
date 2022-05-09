<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request) {
        $size = $request->size ?? 5;
        $data = Book::paginate($size);
        return response()->json($data);
    }
}
