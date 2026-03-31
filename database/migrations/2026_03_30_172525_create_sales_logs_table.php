<?php

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
        Schema::create('sales_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId("order_id")->nullable()->constrained("orders")->nullOnDelete();
            $table->foreignId("cashier_id")->nullable()->constrained("users")->nullOnDelete();
            $table->decimal("amount",8,2)->default(0);
            $table->string("payment_method")->nullable();
            $table->decimal("tax",8,2)->default(0);
            $table->decimal("discount",8,2)->default(0);
            $table->decimal("tip",8,2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_logs');
    }
};
