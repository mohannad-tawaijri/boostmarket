-- AlterTable
ALTER TABLE "services" ADD COLUMN "allowDirectPurchase" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "services" ADD COLUMN "stock" INTEGER;
