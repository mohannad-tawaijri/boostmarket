#!/bin/sh

echo "==> Running database bootstrap..."

# Add missing columns directly (safe with IF NOT EXISTS)
npx prisma db execute --stdin <<'SQL' || true
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "showMessagePopups" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "allowDirectPurchase" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "stock" INTEGER;
DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20260410000000_add_user_service_fields';
SQL

echo "==> Marking migrations as applied..."
npx prisma migrate resolve --applied 20260410120000_add_show_message_popups 2>/dev/null || true
npx prisma migrate resolve --applied 20260410130000_add_stock_and_direct_purchase 2>/dev/null || true

echo "==> Running prisma migrate deploy..."
npx prisma migrate resolve --rolled-back 20260227051129_sync_game_categories 2>/dev/null || true
npx prisma migrate deploy || true

echo "==> Starting application..."
exec node dist/main.js
