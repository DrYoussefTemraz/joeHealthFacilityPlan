-- Split the planner catalogue into healthcare and hospitality verticals while
-- keeping one set of tables.

ALTER TABLE "AssetTemplate" ADD COLUMN "vertical" TEXT NOT NULL DEFAULT 'healthcare';
ALTER TABLE "RoomTemplate" ADD COLUMN "vertical" TEXT NOT NULL DEFAULT 'healthcare';
ALTER TABLE "BuildingPreset" ADD COLUMN "vertical" TEXT NOT NULL DEFAULT 'healthcare';

CREATE INDEX "AssetTemplate_vertical_idx" ON "AssetTemplate"("vertical");
CREATE INDEX "RoomTemplate_vertical_idx" ON "RoomTemplate"("vertical");
CREATE INDEX "BuildingPreset_vertical_idx" ON "BuildingPreset"("vertical");
