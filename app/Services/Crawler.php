<?php

namespace App\Services;

use Spatie\Browsershot\Browsershot;
use Spatie\Browsershot\Exceptions\CouldNotTakeBrowsershot;
use Spatie\Image\Exceptions\InvalidManipulation;
use Spatie\Image\Manipulations;
use Symfony\Component\DomCrawler\Crawler as DomCrawler;

class Crawler
{
    private string $url;
    private Browsershot $page;
    public function __construct($url)
    {
        $this->url = $url;
        $this->page = Browsershot::url($url)
            ->setNodeBinary(env('NODE_PATH'))
            ->setNpmBinary(env('NPM_PATH'))
            ->windowSize(1920, 1080)
            ->waitUntilNetworkIdle();
    }

    public function getBody(): string
    {
        return $this->page->bodyHtml();
    }

    public function getEscapedBody(): string
    {
        return htmlspecialchars($this->getBody());
    }

    public function generateScreenshots(): array
    {
        $filename = md5($this->url . time());
        try {
            $this->page->save(storage_path('app/public/screenshots/' . $filename . '.png'));
            $this->page->fit(Manipulations::FIT_CONTAIN, 800, 600)
                ->save(storage_path('app/public/screenshots/' . $filename . '_800x600.png'));
            $this->page->fit(Manipulations::FIT_CONTAIN, 200, 150)
                ->save(storage_path('app/public/screenshots/' . $filename . '_200x150.png'));
        } catch (CouldNotTakeBrowsershot|InvalidManipulation $e) {
            return [];
        }

        return [
            'original' => '/storage/screenshots/' . $filename . '.png',
            '800x600' => '/storage/screenshots/' . $filename . '_800x600.png',
            '200x150' => '/storage/screenshots/' . $filename . '_200x150.png',
        ];
    }

    public function getTitle(): string
    {
        $crawler = new DomCrawler($this->getBody());
        try {
            $title = $crawler->filter('title')->eq(0)->text();
        } catch (\InvalidArgumentException $e) {
            $title = 'Empty';
        }
        return $title;
    }

    public function getDescription(): string
    {
        $crawler = new DomCrawler($this->getBody());
        try {
            $descriptionDOM = $crawler->filter('meta[name="description"]');
            $descriptionDOM2 = $crawler->filter('meta[name="Description"]');
            $ogDescriptionDOM = $crawler->filter('meta[property="og:description"]');
            $twitterDescriptionDOM = $crawler->filter('meta[name="twitter:description"]');
            $description = $descriptionDOM->count() ? $descriptionDOM->attr('content') : (
                $descriptionDOM2->count() ? $descriptionDOM2->attr('content') : (
                    $ogDescriptionDOM->count() ? $ogDescriptionDOM->attr('content') : (
                        $twitterDescriptionDOM->count() ? $twitterDescriptionDOM->attr('content') : 'Empty'
                    )
                )
            );
        } catch (\InvalidArgumentException $e) {
            $description = 'Empty';
        }
        return $description;
    }
}
