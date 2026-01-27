-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "tags" TEXT[];

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
