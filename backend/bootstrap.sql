ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "showMessagePopups" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "allowDirectPurchase" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "stock" INTEGER;
DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20260410000000_add_user_service_fields';
