<?php

namespace App;

enum TableStatus: string
{
    case AVAILABLE = 'available';
    case OCCUPIED = 'occupied';
    case RESERVED = 'reserved';
    case DIRTY = 'dirty';

    public function label(): string
    {
        return match($this) {
            self::AVAILABLE => 'Available',
            self::OCCUPIED => 'Occupied',
            self::RESERVED => 'Reserved',
            self::DIRTY => 'Dirty',
        };
    }
}
