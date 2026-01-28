/*
  Warnings:

  - A unique constraint covering the columns `[customOfferId]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "customOfferId" TEXT;

-- CreateTable
CREATE TABLE "custom_offers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "serviceId" TEXT,
    "orderId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "custom_offers_orderId_key" ON "custom_offers"("orderId");

-- CreateIndex
CREATE INDEX "custom_offers_senderId_idx" ON "custom_offers"("senderId");

-- CreateIndex
CREATE INDEX "custom_offers_receiverId_idx" ON "custom_offers"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "messages_customOfferId_key" ON "messages"("customOfferId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_customOfferId_fkey" FOREIGN KEY ("customOfferId") REFERENCES "custom_offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
