-- CreateTable
CREATE TABLE "Facility" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "openedYear" INTEGER NOT NULL,
    "siteAreaSqm" INTEGER NOT NULL,
    "grossFloorAreaSqm" INTEGER NOT NULL,
    "licensedBeds" INTEGER,
    "occupancyPct" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "serviceLines" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "facilitySlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "function" TEXT NOT NULL,
    "areaSqm" INTEGER NOT NULL,
    "utilizationPct" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapitalProject" (
    "id" TEXT NOT NULL,
    "facilitySlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "budgetCents" BIGINT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "targetYear" INTEGER NOT NULL,
    "progressPct" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CapitalProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unitCostCents" INTEGER NOT NULL,
    "utilities" TEXT[],
    "roomCategories" TEXT[],
    "appliesToAllRooms" BOOLEAN NOT NULL DEFAULT false,
    "installation" TEXT NOT NULL,

    CONSTRAINT "AssetTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "defaultAreaSqm" INTEGER NOT NULL,
    "patientBeds" INTEGER NOT NULL,
    "utilities" TEXT[],

    CONSTRAINT "RoomTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendedAsset" (
    "roomId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "RecommendedAsset_pkey" PRIMARY KEY ("roomId","assetId")
);

-- CreateTable
CREATE TABLE "BuildingPreset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "BuildingPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresetFloor" (
    "id" TEXT NOT NULL,
    "presetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "PresetFloor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresetRoom" (
    "id" TEXT NOT NULL,
    "presetId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "floorIndex" INTEGER NOT NULL,

    CONSTRAINT "PresetRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresetRoomAsset" (
    "presetRoomId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "PresetRoomAsset_pkey" PRIMARY KEY ("presetRoomId","assetId")
);

-- CreateIndex
CREATE INDEX "Zone_facilitySlug_idx" ON "Zone"("facilitySlug");

-- CreateIndex
CREATE INDEX "CapitalProject_facilitySlug_idx" ON "CapitalProject"("facilitySlug");

-- CreateIndex
CREATE INDEX "AssetTemplate_category_idx" ON "AssetTemplate"("category");

-- CreateIndex
CREATE INDEX "RoomTemplate_category_idx" ON "RoomTemplate"("category");

-- CreateIndex
CREATE UNIQUE INDEX "PresetFloor_presetId_index_key" ON "PresetFloor"("presetId", "index");

-- CreateIndex
CREATE INDEX "PresetRoom_presetId_idx" ON "PresetRoom"("presetId");

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_facilitySlug_fkey" FOREIGN KEY ("facilitySlug") REFERENCES "Facility"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapitalProject" ADD CONSTRAINT "CapitalProject_facilitySlug_fkey" FOREIGN KEY ("facilitySlug") REFERENCES "Facility"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAsset" ADD CONSTRAINT "RecommendedAsset_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "RoomTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedAsset" ADD CONSTRAINT "RecommendedAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "AssetTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresetFloor" ADD CONSTRAINT "PresetFloor_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "BuildingPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresetRoom" ADD CONSTRAINT "PresetRoom_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "BuildingPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresetRoom" ADD CONSTRAINT "PresetRoom_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "RoomTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresetRoomAsset" ADD CONSTRAINT "PresetRoomAsset_presetRoomId_fkey" FOREIGN KEY ("presetRoomId") REFERENCES "PresetRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresetRoomAsset" ADD CONSTRAINT "PresetRoomAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "AssetTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
