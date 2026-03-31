<?php

namespace App;

enum UserType: string
{
    case ADMIN = 'admin';
    case CUSTOMER = 'customer';
    case STAFF = 'staff';

    public function label(): string
    {
        return match($this){
            self::ADMIN => 'Admin',
            self::CUSTOMER => 'Customer',
            self::STAFF => 'Staff',
        };
    }
}
