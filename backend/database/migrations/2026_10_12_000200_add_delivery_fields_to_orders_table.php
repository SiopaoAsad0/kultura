<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds delivery-management columns to the orders table so each order can be
 * assigned to a rider and tracked through a simulated local delivery flow.
 * Idempotent: only adds columns that are missing.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'rider_id')) {
                $table->foreignId('rider_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('orders', 'delivery_status')) {
                // unassigned, assigned, picked_up, in_transit, delivered, failed
                $table->string('delivery_status')->default('unassigned')->after('status');
            }
            if (!Schema::hasColumn('orders', 'assigned_at')) {
                $table->timestamp('assigned_at')->nullable()->after('delivery_status');
            }
            if (!Schema::hasColumn('orders', 'delivered_at')) {
                $table->timestamp('delivered_at')->nullable()->after('assigned_at');
            }
            if (!Schema::hasColumn('orders', 'delivery_notes')) {
                $table->text('delivery_notes')->nullable()->after('delivered_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'rider_id')) {
                $table->dropForeign(['rider_id']);
                $table->dropColumn('rider_id');
            }
            foreach (['delivery_status', 'assigned_at', 'delivered_at', 'delivery_notes'] as $col) {
                if (Schema::hasColumn('orders', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
