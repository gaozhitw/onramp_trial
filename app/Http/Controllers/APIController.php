<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\Crawler;
use Validator;

class APIController extends Controller
{
    public function fetch(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'url' => 'required|url'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid URL'
            ], 400);
        }

        $url = $validator->validated()['url'];
        $crawler = new Crawler($url);
        $escapedBody = $crawler->getEscapedBody();

        $title = $crawler->getTitle();
        $description = $crawler->getDescription();
        $screenshots = $crawler->generateScreenshots();
        if (empty($screenshots)) {
            return response()->json([
                'error' => 'Error generating screenshot'
            ], 500);
        }

        $page = new Page([
            'url' => $url,
            'title' => $title,
            'description' => $description,
            'body' => $escapedBody,
            'screenshot' => $screenshots['original'],
            'screenshot_800x600' => $screenshots['800x600'],
            'screenshot_200x150' => $screenshots['200x150'],
        ]);

        if ($page->save()) {
            return response()->json($page->only([
                'id',
                'created_at',
                'url',
                'title',
                'description',
                'screenshot_200x150',
            ]), 201);
        }

        return response()->json([
            'error' => 'Error saving page'
        ], 500);
    }

    public function history(): JsonResponse
    {
        $pages = Page::paginate(3);
        return response()->json($pages->toArray(), 200);
    }
}
