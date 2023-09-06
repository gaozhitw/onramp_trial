<?php

namespace Tests\Unit;

use App\Services\Crawler;
use Tests\TestCase;

class CrawlerTest extends TestCase
{
    public function test_crawler_get_title(): void
    {
        $crawler = new Crawler('https://www.google.com');

        $title = $crawler->getTitle();

        $this->assertStringContainsString('Google', $title);
    }

    public function test_crawler_get_description(): void
    {
        $crawler = new Crawler('https://github.com');

        $description = $crawler->getDescription();

        $this->assertStringContainsString('GitHub', $description);
    }

    public function test_crawler_generate_screenshots(): void
    {
        $crawler = new Crawler('https://www.google.com');

        $screenshots = $crawler->generateScreenshots();

        $this->assertArrayHasKey('original', $screenshots);
        $this->assertArrayHasKey('800x600', $screenshots);
        $this->assertArrayHasKey('200x150', $screenshots);
        $this->assertFileExists(storage_path('app/public/' . str_replace('/storage', '', $screenshots['original'])));
        $this->assertFileExists(storage_path('app/public/' . str_replace('/storage', '', $screenshots['800x600'])));
        $this->assertFileExists(storage_path('app/public/' . str_replace('/storage', '', $screenshots['200x150'])));
    }
}
