#!/bin/sh

echo "==> Running bootstrap.js to add missing columns..."
node bootstrap.js

echo "==> Marking migrations as applied..."
npx prisma migrate resolve --applied 20260410120000_add_show_message_popups 2>/dev/null || true
npx prisma migrate resolve --applied 20260410130000_add_stock_and_direct_purchase 2>/dev/null || true

echo "==> Running prisma migrate deploy..."
npx prisma migrate resolve --rolled-back 20260227051129_sync_game_categories 2>/dev/null || true
npx prisma migrate deploy || true

echo "==> Starting application..."
exec node dist/main.js
