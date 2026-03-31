<?php

namespace App;

enum MenuCategories: string
{
    case APPETIZERS = "appetizers";
    case MAINS = "mains";
    case DESSERTS = "desserts";
    case DRINKS = "drinks";

    public function label(): string
    {
        return match($this) {
            self::APPETIZERS => "Appetizers",
            self::MAINS => "Mains",
            self::DESSERTS => "Desserts",
            self::DRINKS => "Drinks",
        };
    }
}
