#!/bin/sh

echo "==> Running database bootstrap SQL..."
npx prisma db execute --file ./bootstrap.sql || echo "WARN: bootstrap SQL failed, continuing..."

echo "==> Marking migrations as applied..."
npx prisma migrate resolve --applied 20260410120000_add_show_message_popups 2>/dev/null || true
npx prisma migrate resolve --applied 20260410130000_add_stock_and_direct_purchase 2>/dev/null || true

echo "==> Running prisma migrate deploy..."
npx prisma migrate resolve --rolled-back 20260227051129_sync_game_categories 2>/dev/null || true
npx prisma migrate deploy || echo "WARN: migrate deploy failed, continuing..."

echo "==> Starting application..."
exec node dist/main.js
