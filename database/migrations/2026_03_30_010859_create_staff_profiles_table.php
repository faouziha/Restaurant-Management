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
        Schema::create('staff_profiles', function (Blueprint $table) {
            $table->id();
            
            // The critical link back to the Users table
            // cascadeOnDelete is safe here because if the user is deleted, their HR profile should go too.
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            // HR & Identification Data
            $table->string('staff_id_number')->unique(); // e.g., "EMP-1042"
            $table->date('date_of_birth');
            $table->date('hire_date');
            $table->string('phone_number')->nullable();
            $table->string('emergency_contact')->nullable();
            
            // Optional: Financial/Role specifics that don't belong in the main auth table
            $table->decimal('hourly_rate', 8, 2)->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff_profiles');
    }
};
