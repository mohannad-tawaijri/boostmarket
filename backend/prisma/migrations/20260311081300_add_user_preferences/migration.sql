-- Add notification preferences
ALTER TABLE "users" ADD COLUMN "notifyEmail" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "notifyOrders" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "notifyMessages" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "notifyMarketing" BOOLEAN NOT NULL DEFAULT false;

-- Add privacy preferences
ALTER TABLE "users" ADD COLUMN "showProfile" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "showOnlineStatus" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "allowMessages" BOOLEAN NOT NULL DEFAULT true;
