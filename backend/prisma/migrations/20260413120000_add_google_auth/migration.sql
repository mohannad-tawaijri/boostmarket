-- AlterTable: add Google OAuth fields to users
ALTER TABLE "users" ADD COLUMN "googleId" TEXT;
ALTER TABLE "users" ADD COLUMN "authProvider" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");
