<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The original donations migration was incomplete on some environments
 * (it only created id + timestamps). This migration ensures all columns the
 * Donation model and FundraisingController rely on actually exist, adding any
 * that are missing. It is idempotent and safe to run on any database state.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('donations')) {
            return;
        }

        Schema::table('donations', function (Blueprint $table) {
            if (!Schema::hasColumn('donations', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('donations', 'fundraising_id')) {
                $table->foreignId('fundraising_id')->after('user_id')->constrained()->cascadeOnDelete();
            }
            if (!Schema::hasColumn('donations', 'amount')) {
                $table->decimal('amount', 15, 2)->default(0)->after('fundraising_id');
            }
            if (!Schema::hasColumn('donations', 'message')) {
                $table->text('message')->nullable()->after('amount');
            }
            if (!Schema::hasColumn('donations', 'is_anonymous')) {
                $table->boolean('is_anonymous')->default(false)->after('message');
            }
            if (!Schema::hasColumn('donations', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('is_anonymous');
            }
            if (!Schema::hasColumn('donations', 'transaction_id')) {
                $table->string('transaction_id')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('donations', 'status')) {
                $table->string('status')->default('completed')->after('transaction_id');
            }
        });
    }

    public function down(): void
    {
        // Intentionally left as a no-op: these columns are owned by the
        // original create_donations_table migration and should not be dropped
        // here to avoid data loss.
    }
};
