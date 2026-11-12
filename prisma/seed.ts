import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { facilityFixtures } from "../src/lib/fixtures/facilities";
import { plannerCatalog } from "../src/lib/planner-data";
import type { AssetTemplate } from "../src/lib/types";

const prisma = new PrismaClient();

type PriceMetadata = {
  unitCostCents: number;
  priceConfidence: string;
  priceSourceType: string | null;
  priceSourceTitle: string | null;
  priceSourcePublisher: string | null;
  priceSourceUrl: string | null;
  priceCheckedAt: Date | null;
  priceBasis: string | null;
};

function parseCsv(text: string): Record<string, string>[] {
  const input = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (inQuotes) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const nonEmptyRows = rows.filter((cells) =>
    cells.some((cell) => cell.trim().length > 0),
  );
  const [header, ...dataRows] = nonEmptyRows;
  if (!header) {
    return [];
  }

  return dataRows.map((cells) => {
    const record: Record<string, string> = {};
    header.forEach((column, columnIndex) => {
      record[column] = cells[columnIndex] ?? "";
    });
    return record;
  });
}

function requireColumns(
  rows: Record<string, string>[],
  label: string,
  required: string[],
) {
  const first = rows[0];
  if (!first) {
    throw new Error(`${label} is empty`);
  }

  for (const column of required) {
    if (!(column in first)) {
      throw new Error(`${label} is missing the "${column}" column`);
    }
  }
}

function loadPriceOverlay(assetTemplates: AssetTemplate[]) {
  const dataDir = resolve(process.cwd(), "prisma/data");
  const pricedRows = parseCsv(
    readFileSync(resolve(dataDir, "catalog-assets-priced.csv"), "utf8"),
  );
  const sourceRows = parseCsv(
    readFileSync(resolve(dataDir, "catalog-assets-sources.csv"), "utf8"),
  );

  requireColumns(pricedRows, "catalog-assets-priced.csv", [
    "id",
    "unit_cost_usd",
  ]);
  requireColumns(sourceRows, "catalog-assets-sources.csv", [
    "id",
    "unit_cost_usd_low",
    "unit_cost_usd_expected",
    "unit_cost_usd_high",
    "fx_rate",
    "cost_basis",
    "confidence",
    "source_type",
    "source_title",
    "source_publisher",
    "source_date",
    "source_url",
  ]);

  const pricedById = new Map<string, Record<string, string>>();
  for (const row of pricedRows) {
    if (!row.id) {
      throw new Error("catalog-assets-priced.csv contains a row without an id");
    }
    if (pricedById.has(row.id)) {
      throw new Error(`Duplicate priced row for asset "${row.id}"`);
    }
    pricedById.set(row.id, row);
  }

  const sourcesById = new Map<string, Record<string, string>>();
  for (const row of sourceRows) {
    if (!row.id) {
      throw new Error("catalog-assets-sources.csv contains a row without an id");
    }
    if (sourcesById.has(row.id)) {
      throw new Error(`Duplicate source row for asset "${row.id}"`);
    }
    sourcesById.set(row.id, row);
  }

  const assetIds = new Set(assetTemplates.map((asset) => asset.id));
  if (pricedById.size !== assetIds.size) {
    throw new Error(
      `Priced rows (${pricedById.size}) do not match catalog assets (${assetIds.size})`,
    );
  }
  if (sourcesById.size !== assetIds.size) {
    throw new Error(
      `Source rows (${sourcesById.size}) do not match catalog assets (${assetIds.size})`,
    );
  }

  const allowedConfidence = new Set(["low", "medium", "high"]);
  const overlay = new Map<string, PriceMetadata>();

  for (const asset of assetTemplates) {
    const priced = pricedById.get(asset.id);
    const source = sourcesById.get(asset.id);

    if (!priced) {
      throw new Error(`Missing priced row for asset "${asset.id}"`);
    }
    if (!source) {
      throw new Error(`Missing source row for asset "${asset.id}"`);
    }

    const usd = Number(priced.unit_cost_usd);
    const low = Number(source.unit_cost_usd_low);
    const expected = Number(source.unit_cost_usd_expected);
    const high = Number(source.unit_cost_usd_high);
    const fxRate = Number(source.fx_rate);
    const egpExpected = Number(source.unit_cost_egp_expected);

    if (!Number.isFinite(usd) || usd <= 0) {
      throw new Error(`Invalid USD price for asset "${asset.id}"`);
    }
    if (!Number.isFinite(low) || !Number.isFinite(high) || !Number.isFinite(expected)) {
      throw new Error(`Invalid USD range for asset "${asset.id}"`);
    }
    if (!(low <= expected && expected <= high)) {
      throw new Error(`USD range is out of order for asset "${asset.id}"`);
    }
    if (Math.abs(usd - expected) > 0.01) {
      throw new Error(
        `Priced USD does not match source expected USD for asset "${asset.id}"`,
      );
    }
    if (!(fxRate > 0) || !Number.isFinite(egpExpected)) {
      throw new Error(`Invalid FX/EGP data for asset "${asset.id}"`);
    }
    if (Math.abs(expected - egpExpected / fxRate) > 0.02) {
      throw new Error(
        `EGP/USD conversion does not match for asset "${asset.id}"`,
      );
    }

    const unitCostCents = Math.round(usd * 100);
    if (
      !Number.isSafeInteger(unitCostCents) ||
      unitCostCents > 2_147_483_647
    ) {
      throw new Error(`USD price exceeds the Int column for asset "${asset.id}"`);
    }

    const confidence = source.confidence.trim();
    if (!allowedConfidence.has(confidence)) {
      throw new Error(
        `Invalid confidence "${confidence}" for asset "${asset.id}"`,
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.source_date)) {
      throw new Error(`Invalid source date for asset "${asset.id}"`);
    }
    const checkedAt = new Date(`${source.source_date}T00:00:00.000Z`);
    if (Number.isNaN(checkedAt.getTime())) {
      throw new Error(`Invalid source date for asset "${asset.id}"`);
    }

    const sourceUrl = source.source_url.trim();
    overlay.set(asset.id, {
      unitCostCents,
      priceConfidence: confidence,
      priceSourceType: source.source_type.trim() || null,
      priceSourceTitle: source.source_title.trim() || null,
      priceSourcePublisher: source.source_publisher.trim() || null,
      priceSourceUrl:
        !sourceUrl || sourceUrl.toLowerCase() === "none" ? null : sourceUrl,
      priceCheckedAt: checkedAt,
      priceBasis: source.cost_basis.trim() || null,
    });
  }

  return overlay;
}

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
  const priceOverlay = loadPriceOverlay(assetTemplates);

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
        data: assetTemplates.map((asset, index) => {
          const price = priceOverlay.get(asset.id);
          if (!price) {
            throw new Error(`Missing price overlay for asset "${asset.id}"`);
          }

          return {
            id: asset.id,
            name: asset.name,
            category: asset.category,
            description: asset.description,
            unitCostCents: price.unitCostCents,
            priceConfidence: price.priceConfidence,
            priceSourceType: price.priceSourceType,
            priceSourceTitle: price.priceSourceTitle,
            priceSourcePublisher: price.priceSourcePublisher,
            priceSourceUrl: price.priceSourceUrl,
            priceCheckedAt: price.priceCheckedAt,
            priceBasis: price.priceBasis,
            utilities: asset.utilities,
            roomCategories:
              asset.roomCategories === "all" ? [] : asset.roomCategories,
            appliesToAllRooms: asset.roomCategories === "all",
            installation: asset.installation,
            sortOrder: index,
          };
        }),
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

  const [facilities, zones, projects, rooms, assets, presets, priceGroups] =
    await Promise.all([
      prisma.facility.count(),
      prisma.zone.count(),
      prisma.capitalProject.count(),
      prisma.roomTemplate.count(),
      prisma.assetTemplate.count(),
      prisma.buildingPreset.count(),
      prisma.assetTemplate.groupBy({
        by: ["priceConfidence"],
        _count: { _all: true },
      }),
    ]);

  console.log("Seed complete", {
    facilities,
    zones,
    projects,
    rooms,
    assets,
    presets,
    priceConfidence: Object.fromEntries(
      priceGroups.map((group) => [
        group.priceConfidence,
        group._count._all,
      ]),
    ),
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
