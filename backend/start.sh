#!/bin/sh
set -e

echo "==> Running database bootstrap..."

# Add missing columns (IF NOT EXISTS prevents errors if already there)
npx prisma db execute --stdin <<'SQL' 2>/dev/null || true
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "showMessagePopups" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "allowDirectPurchase" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "stock" INTEGER;
SQL

echo "==> Marking migrations as applied..."
npx prisma migrate resolve --applied 20260410120000_add_show_message_popups 2>/dev/null || true
npx prisma migrate resolve --applied 20260410130000_add_stock_and_direct_purchase 2>/dev/null || true

echo "==> Running prisma migrate deploy..."
npx prisma migrate resolve --rolled-back 20260227051129_sync_game_categories 2>/dev/null || true
npx prisma migrate deploy || true

echo "==> Starting application..."
node dist/main.js
