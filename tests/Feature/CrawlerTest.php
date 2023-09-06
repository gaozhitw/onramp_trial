<?php

namespace Tests\Feature;

use Tests\TestCase;

class CrawlerTest extends TestCase
{
    public function test_crawler(): void
    {
        $this->post('/api/fetch', [
            'url' => 'https://github.com/',
        ])->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'created_at',
                'url',
                'title',
                'description',
                'screenshot_200x150',
            ])
            ->assertJson([
                'title' => 'GitHub: Let’s build from here · GitHub',
                'description' => 'GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and features, power your CI/CD and DevOps workflows, and secure code before you commit it.',
            ]);
    }
}
