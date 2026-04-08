<?php

namespace App\Models;

use App\MenuCategories;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'price',
        'description',
        'image_url',
        'category',
        'sold_out',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'sold_out' => 'boolean',
            'category' => MenuCategories::class,
        ];
    }
}
