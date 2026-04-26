<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'waiter_id',
        'type',
        'table_id',
        'status',
        'total_price',
        'read_at',
    ];

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function waiter()
    {
        return $this->belongsTo(User::class, 'waiter_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
