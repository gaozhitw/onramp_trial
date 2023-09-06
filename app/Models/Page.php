<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'url',
        'title',
        'description',
        'body',
        'screenshot',
        'screenshot_800x600',
        'screenshot_200x150',
    ];
}
