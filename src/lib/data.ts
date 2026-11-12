import type {
  CapitalProject,
  ContactDetail,
  Facility,
  PlannerCatalog,
  PlanningCapability,
} from "./types";

import { plannerCatalog } from "./planner-data";

/**
 * Single content/data-access seam for JoeHealthPlan.
 *
 * Everything the pages read goes through the async functions at the bottom of
 * this file, which currently return in-memory fixtures. Swapping in a real
 * backend means rewriting those function bodies only — the pages, components
 * and types stay untouched.
 *
 * Prisma + MongoDB:    `prisma.facility.findMany({ include: { zones, projects } })`.
 * Appwrite:            the `node-appwrite` SDK (`Databases.listDocuments`).
 *                      Prisma does not talk to Appwrite's database directly.
 *
 * Keep the functions async even when they return fixtures, and return fresh
 * copies so callers cannot mutate the fixtures (a real query would return new
 * objects on every call).
 */

const facilities: Facility[] = [
  {
    slug: "northside-general-hospital",
    name: "Northside General Hospital",
    type: "hospital",
    status: "expansion",
    city: "Austin",
    region: "TX",
    openedYear: 1998,
    siteAreaSqm: 62000,
    grossFloorAreaSqm: 148500,
    licensedBeds: 420,
    occupancyPct: 87,
    summary:
      "The portfolio's flagship acute site, with a level II trauma center and roughly two thirds of all inpatient capacity.",
    serviceLines: [
      "Emergency",
      "Cardiology",
      "Oncology",
      "Maternity",
      "Orthopedics",
    ],
    zones: [
      {
        id: "ngh-ed",
        name: "Emergency department",
        function: "Acute care",
        areaSqm: 8400,
        utilizationPct: 92,
        condition: "fair",
      },
      {
        id: "ngh-ors",
        name: "Operating rooms",
        function: "Surgical",
        areaSqm: 5600,
        utilizationPct: 84,
        condition: "good",
      },
      {
        id: "ngh-cardiology",
        name: "Cardiology ward",
        function: "Inpatient",
        areaSqm: 7200,
        utilizationPct: 89,
        condition: "good",
      },
      {
        id: "ngh-cssd",
        name: "Central sterile services",
        function: "Support",
        areaSqm: 1900,
        utilizationPct: 78,
        condition: "poor",
      },
      {
        id: "ngh-outpatients",
        name: "Outpatient clinics",
        function: "Ambulatory",
        areaSqm: 6300,
        utilizationPct: 71,
        condition: "good",
      },
    ],
    projects: [
      {
        id: "prj-ngh-tower",
        facilitySlug: "northside-general-hospital",
        name: "North tower capacity expansion",
        category: "new-build",
        phase: "construction",
        budgetCents: 14_800_000_000,
        startYear: 2025,
        targetYear: 2028,
        progressPct: 42,
        description:
          "Six-storey inpatient tower adding 120 beds, four operating rooms and a new central sterile department.",
      },
      {
        id: "prj-ngh-ed",
        facilitySlug: "northside-general-hospital",
        name: "Emergency department reconfiguration",
        category: "renovation",
        phase: "approvals",
        budgetCents: 1_240_000_000,
        startYear: 2026,
        targetYear: 2027,
        progressPct: 15,
        description:
          "Splits triage, majors and resus into separate front-of-house zones to cut ambulance offload times.",
      },
      {
        id: "prj-ngh-chiller",
        facilitySlug: "northside-general-hospital",
        name: "Chiller plant replacement",
        category: "infrastructure",
        phase: "complete",
        budgetCents: 680_000_000,
        startYear: 2023,
        targetYear: 2025,
        progressPct: 100,
        description:
          "End-of-life chillers replaced with a duty-standby configuration and heat recovery for the east wing.",
      },
    ],
  },
  {
    slug: "lakeview-surgical-center",
    name: "Lakeview Surgical Center",
    type: "surgical-center",
    status: "operational",
    city: "Round Rock",
    region: "TX",
    openedYear: 2012,
    siteAreaSqm: 14200,
    grossFloorAreaSqm: 21800,
    licensedBeds: 12,
    occupancyPct: 74,
    summary:
      "Eight operating rooms running at 74% utilization, with spare recovery capacity to absorb referrals from the main hospital.",
    serviceLines: [
      "Day surgery",
      "Endoscopy",
      "Pain management",
      "Ophthalmology",
    ],
    zones: [
      {
        id: "lsc-ors",
        name: "Operating rooms",
        function: "Surgical",
        areaSqm: 3100,
        utilizationPct: 76,
        condition: "good",
      },
      {
        id: "lsc-recovery",
        name: "Recovery bay",
        function: "Post-anesthesia",
        areaSqm: 1200,
        utilizationPct: 68,
        condition: "good",
      },
      {
        id: "lsc-endoscopy",
        name: "Endoscopy suite",
        function: "Diagnostic",
        areaSqm: 1450,
        utilizationPct: 72,
        condition: "good",
      },
      {
        id: "lsc-cssd",
        name: "Sterile processing",
        function: "Support",
        areaSqm: 850,
        utilizationPct: 81,
        condition: "fair",
      },
    ],
    projects: [
      {
        id: "prj-lsc-endoscopy",
        facilitySlug: "lakeview-surgical-center",
        name: "Fourth endoscopy room fit-out",
        category: "expansion",
        phase: "design",
        budgetCents: 320_000_000,
        startYear: 2026,
        targetYear: 2027,
        progressPct: 20,
        description:
          "Converts adjacent storage into a fourth procedure room, lifting endoscopy throughput by an estimated 26%.",
      },
      {
        id: "prj-lsc-hvac",
        facilitySlug: "lakeview-surgical-center",
        name: "Air handling and HVAC upgrade",
        category: "infrastructure",
        phase: "commissioning",
        budgetCents: 245_000_000,
        startYear: 2024,
        targetYear: 2026,
        progressPct: 88,
        description:
          "Operating room air changes brought up to current standards, with monitored pressure differentials per room.",
      },
    ],
  },
  {
    slug: "cedar-park-outpatient-clinic",
    name: "Cedar Park Outpatient Clinic",
    type: "outpatient-clinic",
    status: "under-construction",
    city: "Cedar Park",
    region: "TX",
    openedYear: 2019,
    siteAreaSqm: 6400,
    grossFloorAreaSqm: 9600,
    licensedBeds: null,
    occupancyPct: 81,
    summary:
      "Community clinic at 81% utilization, with an annex under construction that will add 22 exam rooms and a minor procedures suite.",
    serviceLines: [
      "Primary care",
      "Pediatrics",
      "Physical therapy",
      "Phlebotomy",
    ],
    zones: [
      {
        id: "cpoc-exam",
        name: "Exam rooms",
        function: "Ambulatory",
        areaSqm: 2100,
        utilizationPct: 88,
        condition: "good",
      },
      {
        id: "cpoc-therapy",
        name: "Physical therapy gym",
        function: "Rehabilitation",
        areaSqm: 780,
        utilizationPct: 74,
        condition: "good",
      },
      {
        id: "cpoc-phlebotomy",
        name: "Phlebotomy and sample handling",
        function: "Diagnostic",
        areaSqm: 320,
        utilizationPct: 83,
        condition: "fair",
      },
    ],
    projects: [
      {
        id: "prj-cpoc-annex",
        facilitySlug: "cedar-park-outpatient-clinic",
        name: "Clinic annex: 22 exam rooms",
        category: "new-build",
        phase: "construction",
        budgetCents: 975_000_000,
        startYear: 2025,
        targetYear: 2027,
        progressPct: 55,
        description:
          "Two-storey annex on the eastern parking lot, plus a minor procedures suite and 40 additional parking spaces.",
      },
      {
        id: "prj-cpoc-signage",
        facilitySlug: "cedar-park-outpatient-clinic",
        name: "Signage and wayfinding refresh",
        category: "renovation",
        phase: "approvals",
        budgetCents: 48_000_000,
        startYear: 2026,
        targetYear: 2026,
        progressPct: 10,
        description:
          "Standardized wayfinding across both wings to match the annex layout and reduce front-desk escort time.",
      },
    ],
  },
  {
    slug: "riverbend-diagnostic-center",
    name: "Riverbend Diagnostic Center",
    type: "diagnostic-center",
    status: "planning",
    city: "Austin",
    region: "TX",
    openedYear: 2005,
    siteAreaSqm: 9800,
    grossFloorAreaSqm: 16200,
    licensedBeds: null,
    occupancyPct: 68,
    summary:
      "Imaging-heavy site where two scanners are past their planned lifecycle, and the anchor of a proposed replacement build.",
    serviceLines: [
      "MRI and CT",
      "Ultrasound",
      "Nuclear medicine",
      "Cardiac diagnostics",
    ],
    zones: [
      {
        id: "rbdc-mri",
        name: "MRI suite",
        function: "Diagnostic",
        areaSqm: 640,
        utilizationPct: 79,
        condition: "fair",
      },
      {
        id: "rbdc-ct",
        name: "CT and X-ray",
        function: "Diagnostic",
        areaSqm: 890,
        utilizationPct: 83,
        condition: "good",
      },
      {
        id: "rbdc-nuclear",
        name: "Nuclear medicine",
        function: "Diagnostic",
        areaSqm: 410,
        utilizationPct: 62,
        condition: "poor",
      },
      {
        id: "rbdc-admin",
        name: "Reporting and administration",
        function: "Administration",
        areaSqm: 520,
        utilizationPct: 58,
        condition: "good",
      },
    ],
    projects: [
      {
        id: "prj-rbdc-replacement",
        facilitySlug: "riverbend-diagnostic-center",
        name: "Replacement diagnostic center",
        category: "new-build",
        phase: "concept",
        budgetCents: 8_600_000_000,
        startYear: 2027,
        targetYear: 2031,
        progressPct: 5,
        description:
          "Concept option to rebuild on the adjacent plot rather than refurbish, trading capital cost for capacity and lifecycle.",
      },
      {
        id: "prj-rbdc-mri",
        facilitySlug: "riverbend-diagnostic-center",
        name: "MRI 1 replacement and shielding",
        category: "equipment",
        phase: "approvals",
        budgetCents: 490_000_000,
        startYear: 2026,
        targetYear: 2027,
        progressPct: 12,
        description:
          "Interim scanner replacement to hold imaging capacity until the replacement build is decided.",
      },
      {
        id: "prj-rbdc-nuclear",
        facilitySlug: "riverbend-diagnostic-center",
        name: "Nuclear medicine suite refurbishment",
        category: "renovation",
        phase: "complete",
        budgetCents: 215_000_000,
        startYear: 2023,
        targetYear: 2024,
        progressPct: 100,
        description:
          "Hot lab and scanning room refurbished to current radiation protection requirements.",
      },
    ],
  },
];

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

export async function getFacilities(): Promise<Facility[]> {
  return structuredClone(facilities);
}

export async function getFacilityBySlug(slug: string): Promise<Facility | null> {
  const facility = facilities.find((candidate) => candidate.slug === slug);
  return facility ? structuredClone(facility) : null;
}

/** Every capital project across the portfolio, flattened. */
export async function getCapitalProjects(): Promise<CapitalProject[]> {
  return structuredClone(facilities.flatMap((facility) => facility.projects));
}

export async function getPlanningCapabilities(): Promise<PlanningCapability[]> {
  return structuredClone(planningCapabilities);
}

export async function getContactDetails(): Promise<ContactDetail[]> {
  return structuredClone(contactDetails);
}

/**
 * Catalog for the virtual building planner. The fixtures live in
 * `src/lib/planner-data/`; replacing this body with an API or database query is
 * the only change needed when the catalog moves to the backend.
 */
export async function getPlannerCatalog(): Promise<PlannerCatalog> {
  return structuredClone(plannerCatalog);
}
