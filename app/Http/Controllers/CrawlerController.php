<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CrawlerController extends Controller
{
    public function index()
    {
        return Inertia::render('Crawler/index', [
            'pages' => Page::select(
                'id',
                'created_at',
                'url',
                'title',
                'description',
                'screenshot_200x150'
            )->orderBy('created_at', 'desc')->paginate(3)
        ]);
    }

    public function detail(Request $request, int $id)
    {
        return Inertia::render('Crawler/detail', [
            'page' => Page::findOrFail($id)
        ]);
    }
}
