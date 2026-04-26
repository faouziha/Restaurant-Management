<?php

namespace App\Models;

use App\TableStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Table extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'waiter_id',
        'status',
        'position_x',
        'position_y'
    ];

    protected function casts(): array
    {
        return [
            'waiter_id' => 'integer',
            'status' => TableStatus::class,
        ];
    }

    public function waiter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'waiter_id');
    }
}
