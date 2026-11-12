import { PrismaClient } from "@prisma/client";

import { facilityFixtures } from "../src/lib/fixtures/facilities";
import { plannerCatalog } from "../src/lib/planner-data";

const prisma = new PrismaClient();

async function seedFacilities() {
  for (const [facilityIndex, facility] of facilityFixtures.entries()) {
    const { zones, projects, ...scalars } = facility;

    await prisma.$transaction(async (tx) => {
      await tx.facility.upsert({
        where: { slug: facility.slug },
        update: { ...scalars, sortOrder: facilityIndex },
        create: { ...scalars, sortOrder: facilityIndex },
      });

      // Reference data owned by the facility: replace it wholesale so the
      // seed is idempotent and removed fixtures do not linger.
      await tx.zone.deleteMany({ where: { facilitySlug: facility.slug } });
      await tx.capitalProject.deleteMany({
        where: { facilitySlug: facility.slug },
      });

      await tx.zone.createMany({
        data: zones.map((zone, index) => ({
          ...zone,
          facilitySlug: facility.slug,
          sortOrder: index,
        })),
      });

      await tx.capitalProject.createMany({
        data: projects.map((project, index) => ({
          id: project.id,
          facilitySlug: facility.slug,
          name: project.name,
          category: project.category,
          phase: project.phase,
          budgetCents: BigInt(project.budgetCents),
          startYear: project.startYear,
          targetYear: project.targetYear,
          progressPct: project.progressPct,
          description: project.description,
          sortOrder: index,
        })),
      });
    });
  }
}

async function seedCatalog() {
  const { assetTemplates, roomTemplates, buildingPresets } = plannerCatalog;

  await prisma.$transaction(
    async (tx) => {
      // The catalog is reference data. Replace it wholesale; saved plans will
      // move to upserts once user plans reference these rows.
      await tx.presetRoomAsset.deleteMany();
      await tx.presetRoom.deleteMany();
      await tx.presetFloor.deleteMany();
      await tx.buildingPreset.deleteMany();
      await tx.recommendedAsset.deleteMany();
      await tx.roomTemplate.deleteMany();
      await tx.assetTemplate.deleteMany();

      await tx.assetTemplate.createMany({
        data: assetTemplates.map((asset, index) => ({
          id: asset.id,
          name: asset.name,
          category: asset.category,
          description: asset.description,
          unitCostCents: asset.unitCostCents,
          utilities: asset.utilities,
          roomCategories:
            asset.roomCategories === "all" ? [] : asset.roomCategories,
          appliesToAllRooms: asset.roomCategories === "all",
          installation: asset.installation,
          sortOrder: index,
        })),
      });

      await tx.roomTemplate.createMany({
        data: roomTemplates.map((room, index) => ({
          id: room.id,
          name: room.name,
          category: room.category,
          description: room.description,
          defaultAreaSqm: room.defaultAreaSqm,
          patientBeds: room.patientBeds,
          utilities: room.utilities,
          sortOrder: index,
        })),
      });

      await tx.recommendedAsset.createMany({
        data: roomTemplates.flatMap((room) =>
          room.recommendedSetup.map((asset, index) => ({
            roomId: room.id,
            assetId: asset.assetId,
            quantity: asset.quantity,
            sortOrder: index,
          })),
        ),
      });

      for (const [presetIndex, preset] of buildingPresets.entries()) {
        await tx.buildingPreset.create({
          data: {
            id: preset.id,
            name: preset.name,
            description: preset.description,
            sortOrder: presetIndex,
            floors: {
              create: preset.floors.map((name, index) => ({ name, index })),
            },
            rooms: {
              create: preset.rooms.map((room, roomIndex) => ({
                floorIndex: room.floorIndex,
                sortOrder: roomIndex,
                template: { connect: { id: room.templateId } },
                ...(room.assets?.length
                  ? {
                      assets: {
                        create: room.assets.map((asset, assetIndex) => ({
                          quantity: asset.quantity,
                          sortOrder: assetIndex,
                          asset: { connect: { id: asset.assetId } },
                        })),
                      },
                    }
                  : {}),
              })),
            },
          },
        });
      }
    },
    { maxWait: 10_000, timeout: 120_000 },
  );
}

async function main() {
  await seedFacilities();
  await seedCatalog();

  const [facilities, zones, projects, rooms, assets, presets] =
    await Promise.all([
      prisma.facility.count(),
      prisma.zone.count(),
      prisma.capitalProject.count(),
      prisma.roomTemplate.count(),
      prisma.assetTemplate.count(),
      prisma.buildingPreset.count(),
    ]);

  console.log("Seed complete", {
    facilities,
    zones,
    projects,
    rooms,
    assets,
    presets,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
