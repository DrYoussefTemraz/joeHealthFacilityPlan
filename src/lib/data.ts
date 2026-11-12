import type { Prisma } from "@prisma/client";
import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "./db";
import type {
  AssetTemplate,
  BuildingPreset,
  CapitalProject,
  ContactDetail,
  Facility,
  PlannerCatalog,
  PlanningCapability,
  ReviewRequestInput,
  RoomCategory,
  RoomTemplate,
  Zone,
} from "./types";

/**
 * Single content/data-access seam for JoeHealthPlan.
 *
 * Pages and components read through the async functions in this file only.
 * Facilities, capital projects and the planner catalog come from Postgres via
 * Prisma; planning capabilities and contact details remain static copy until
 * they get their own tables.
 *
 * Cached getters use `"use cache"` with an explicit lifetime and tag. Every
 * value they return must be serializable, which is why the mappers convert
 * Postgres `BIGINT` budgets and Prisma records into plain domain objects.
 */

type FacilityRecord = Prisma.FacilityGetPayload<{
  include: { zones: true; projects: true };
}>;
type ProjectRecord = FacilityRecord["projects"][number];
type ZoneRecord = FacilityRecord["zones"][number];
type AssetRecord = Prisma.AssetTemplateGetPayload<Record<string, never>>;
type RoomRecord = Prisma.RoomTemplateGetPayload<{
  include: { recommendedSetup: true };
}>;
type PresetRecord = Prisma.BuildingPresetGetPayload<{
  include: {
    floors: true;
    rooms: { include: { assets: true } };
  };
}>;

const planningCapabilities: PlanningCapability[] = [
  {
    slug: "master-site-planning",
    title: "Master site planning",
    summary:
      "Model site capacity, adjacencies and growth options before committing capital to a direction.",
    icon: "blueprint",
  },
  {
    slug: "zone-planning",
    title: "Zone and department planning",
    summary:
      "Break each site into functional zones and see how space, clinical function and utilization line up.",
    icon: "grid",
  },
  {
    slug: "capacity-utilization",
    title: "Capacity and utilization",
    summary:
      "Track occupancy, operating room utilization and condition ratings to catch the binding constraint early.",
    icon: "gauge",
  },
  {
    slug: "capital-roadmap",
    title: "Capital roadmap",
    summary:
      "One phased program across every site, with budgets, start years and target completion dates.",
    icon: "budget",
  },
  {
    slug: "approvals-compliance",
    title: "Approvals and compliance",
    summary:
      "Keep design, regulatory and accreditation gates visible on the critical path, not discovered late.",
    icon: "clipboard",
  },
  {
    slug: "phased-delivery",
    title: "Phased delivery",
    summary:
      "Sequence concept, design, construction and commissioning so live sites keep operating throughout.",
    icon: "calendar",
  },
];

const contactDetails: ContactDetail[] = [
  { icon: "phone", label: "Planning office", value: "(512) 555-0184" },
  { icon: "mail", label: "Email", value: "planning@joehealthplan.example" },
  { icon: "clock", label: "Hours", value: "Mon–Fri, 8am–6pm CT" },
  { icon: "pin", label: "Office", value: "1201 Rio Grande St, Austin, TX" },
];

function toZone(row: ZoneRecord): Zone {
  return {
    id: row.id,
    name: row.name,
    function: row.function,
    areaSqm: row.areaSqm,
    utilizationPct: row.utilizationPct,
    condition: row.condition as Zone["condition"],
  };
}

function toCapitalProject(row: ProjectRecord): CapitalProject {
  return {
    id: row.id,
    facilitySlug: row.facilitySlug,
    name: row.name,
    category: row.category as CapitalProject["category"],
    phase: row.phase as CapitalProject["phase"],
    // BIGINT in Postgres; safely below Number.MAX_SAFE_INTEGER.
    budgetCents: Number(row.budgetCents),
    startYear: row.startYear,
    targetYear: row.targetYear,
    progressPct: row.progressPct,
    description: row.description,
  };
}

function toFacility(row: FacilityRecord): Facility {
  return {
    slug: row.slug,
    name: row.name,
    type: row.type as Facility["type"],
    status: row.status as Facility["status"],
    city: row.city,
    region: row.region,
    openedYear: row.openedYear,
    siteAreaSqm: row.siteAreaSqm,
    grossFloorAreaSqm: row.grossFloorAreaSqm,
    licensedBeds: row.licensedBeds,
    occupancyPct: row.occupancyPct,
    summary: row.summary,
    serviceLines: row.serviceLines,
    zones: row.zones.map(toZone),
    projects: row.projects.map(toCapitalProject),
  };
}

function toAsset(row: AssetRecord): AssetTemplate {
  return {
    id: row.id,
    name: row.name,
    category: row.category as AssetTemplate["category"],
    description: row.description,
    unitCostCents: row.unitCostCents,
    priceConfidence: row.priceConfidence as AssetTemplate["priceConfidence"],
    priceSourceType: row.priceSourceType ?? undefined,
    priceSourceTitle: row.priceSourceTitle ?? undefined,
    priceSourcePublisher: row.priceSourcePublisher ?? undefined,
    priceSourceUrl: row.priceSourceUrl ?? undefined,
    priceCheckedAt: row.priceCheckedAt
      ? row.priceCheckedAt.toISOString().slice(0, 10)
      : undefined,
    priceBasis: row.priceBasis ?? undefined,
    utilities: row.utilities as AssetTemplate["utilities"],
    roomCategories: row.appliesToAllRooms
      ? "all"
      : (row.roomCategories as RoomCategory[]),
    installation: row.installation as AssetTemplate["installation"],
  };
}

function toRoom(row: RoomRecord): RoomTemplate {
  return {
    id: row.id,
    name: row.name,
    category: row.category as RoomTemplate["category"],
    description: row.description,
    defaultAreaSqm: row.defaultAreaSqm,
    patientBeds: row.patientBeds,
    utilities: row.utilities as RoomTemplate["utilities"],
    recommendedSetup: row.recommendedSetup.map((asset) => ({
      assetId: asset.assetId,
      quantity: asset.quantity,
    })),
  };
}

function toPreset(row: PresetRecord): BuildingPreset {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    floors: row.floors.map((floor) => floor.name),
    rooms: row.rooms.map((room) => ({
      templateId: room.templateId,
      floorIndex: room.floorIndex,
      ...(room.assets.length
        ? {
            assets: room.assets.map((asset) => ({
              assetId: asset.assetId,
              quantity: asset.quantity,
            })),
          }
        : {}),
    })),
  };
}

const facilityInclude = {
  zones: { orderBy: { sortOrder: "asc" } },
  projects: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.FacilityInclude;

export async function getFacilities(): Promise<Facility[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("facilities");

  const rows = await prisma.facility.findMany({
    orderBy: { sortOrder: "asc" },
    include: facilityInclude,
  });

  return rows.map(toFacility);
}

export async function getFacilityBySlug(slug: string): Promise<Facility | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("facilities", `facility-${slug}`);

  const row = await prisma.facility.findUnique({
    where: { slug },
    include: facilityInclude,
  });

  return row ? toFacility(row) : null;
}

/** Every capital project across the portfolio, flattened. */
export async function getCapitalProjects(): Promise<CapitalProject[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("facilities", "projects");

  const rows = await prisma.facility.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      projects: { orderBy: { sortOrder: "asc" } },
    },
  });

  return rows.flatMap((facility) => facility.projects.map(toCapitalProject));
}

export async function getPlanningCapabilities(): Promise<PlanningCapability[]> {
  return structuredClone(planningCapabilities);
}

export async function getContactDetails(): Promise<ContactDetail[]> {
  return structuredClone(contactDetails);
}

/**
 * Persist a contact / review request.
 *
 * This is a mutation, so it is intentionally not wrapped in `"use cache"`.
 * Validation happens in the Server Action before this function is called.
 */
export async function createReviewRequest(
  input: ReviewRequestInput,
): Promise<{ id: string }> {
  return prisma.reviewRequest.create({
    data: {
      name: input.name,
      email: input.email,
      facility: input.facility,
      topic: input.topic,
      message: input.message,
    },
    select: { id: true },
  });
}

/**
 * Catalog for the virtual building planner.
 *
 * Assets, room templates and example buildings live in separate tables. The
 * mapper rebuilds the `PlannerCatalog` shape, including the `assets` override
 * that is only present on some preset rooms.
 */
export async function getPlannerCatalog(): Promise<PlannerCatalog> {
  "use cache";
  cacheLife("hours");
  cacheTag("planner-catalog");

  const [assetRows, roomRows, presetRows] = await Promise.all([
    prisma.assetTemplate.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.roomTemplate.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        recommendedSetup: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.buildingPreset.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        floors: { orderBy: { index: "asc" } },
        rooms: {
          orderBy: { sortOrder: "asc" },
          include: { assets: { orderBy: { sortOrder: "asc" } } },
        },
      },
    }),
  ]);

  return {
    assetTemplates: assetRows.map(toAsset),
    roomTemplates: roomRows.map(toRoom),
    buildingPresets: presetRows.map(toPreset),
  };
}
