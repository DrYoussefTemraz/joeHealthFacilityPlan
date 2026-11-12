-- AlterTable
ALTER TABLE "PresetRoom" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PresetRoomAsset" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "RecommendedAsset" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
