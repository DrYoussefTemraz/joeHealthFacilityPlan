-- AlterTable
ALTER TABLE "AssetTemplate" ADD COLUMN     "priceBasis" TEXT,
ADD COLUMN     "priceCheckedAt" TIMESTAMP(3),
ADD COLUMN     "priceConfidence" TEXT NOT NULL DEFAULT 'low',
ADD COLUMN     "priceSourcePublisher" TEXT,
ADD COLUMN     "priceSourceTitle" TEXT,
ADD COLUMN     "priceSourceType" TEXT,
ADD COLUMN     "priceSourceUrl" TEXT;
