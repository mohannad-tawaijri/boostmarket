-- Create MessageStatus enum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- Add new columns to messages
ALTER TABLE "messages" ADD COLUMN "status" "MessageStatus" NOT NULL DEFAULT 'SENT';
ALTER TABLE "messages" ADD COLUMN "readAt" TIMESTAMP(3);
ALTER TABLE "messages" ADD COLUMN "deliveredAt" TIMESTAMP(3);

-- Migrate existing data: read=true → READ, read=false → SENT
UPDATE "messages" SET "status" = 'READ', "readAt" = "createdAt" WHERE "read" = true;

-- Drop old read column
ALTER TABLE "messages" DROP COLUMN "read";

-- Add showReadReceipts to users
ALTER TABLE "users" ADD COLUMN "showReadReceipts" BOOLEAN NOT NULL DEFAULT true;
