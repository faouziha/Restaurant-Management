<?php

use App\Models\Table;
use App\Models\User;
use App\OrderStatus;
use App\OrderType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("orders", function (Blueprint $table) {
            $table->id();
            $table->foreignId(User::class)->constrained()->nullOnDelete();
            $table->foreignId("waiter_id")->constrained("users")->nullOnDelete();
            $table->string("type")->default(OrderType::DINE_IN->value);
            $table->foreignId(Table::class)->nullable()->constrained();
            $table->string("status")->default(OrderStatus::PENDING->value);
            $table->decimal("total_price",8,2)->default(0);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
