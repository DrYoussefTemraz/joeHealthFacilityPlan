# JoeHealthPlan

A Next.js starter for **healthcare facility master and capital planning**: one
view of site capacity, functional zones and every capital project in a facility
portfolio, from concept through commissioning. It also includes an interactive
**virtual hospital building planner** at `/planner`.

> This is a starter project with sample data. It does not represent a real
> capital program, budget or approval for any facility.

## Stack

| Piece     | Version / choice                      |
| --------- | ------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)    |
| React     | 19                                    |
| Language  | TypeScript (strict)                   |
| Styling   | Tailwind CSS v4                       |
| Linting   | ESLint (`eslint-config-next`)         |
| Caching   | `cacheComponents` enabled (see below) |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script          | Purpose                    |
| --------------- | -------------------------- |
| `npm run dev`   | Dev server with hot reload |
| `npm run build` | Production build           |
| `npm run lint`  | ESLint                     |
| `npm run start` | Serve the production build |

## Routes

| Route                   | What it shows                                                                 |
| ----------------------- | ----------------------------------------------------------------------------- |
| `/`                     | Hero and portfolio stats, planning capabilities, facility cards, capital roadmap grouped by phase, CTA |
| `/facilities`           | Every facility as a card, plus a portfolio comparison table                    |
| `/facilities/[slug]`    | One facility: key metrics, capital program with progress, functional zones, service lines |
| `/planner`              | Virtual hospital building planner: add rooms floor by floor, equip them, review utilities, totals and bill of materials |
| `/contact`              | Planning office details and a placeholder request form                        |

## Project structure

```
src/
  app/
    layout.tsx                    Root layout: fonts, metadata, header + footer shell
    page.tsx                      Home
    facilities/page.tsx           Facility list + comparison table
    facilities/[slug]/page.tsx    Facility plan (generateStaticParams + generateMetadata)
    planner/page.tsx              Virtual hospital building planner
    contact/page.tsx              Contact
    globals.css                   Design tokens (light + dark) and base styles
  components/
    site-header.tsx               Sticky nav
    site-footer.tsx               Footer, reads contact details from the data layer
    logo.tsx                      Wordmark, shared by header and footer
    facility-card.tsx             One facility, with capacity and capital summary
    capital-project-row.tsx       One capital project, with phase badge and progress bar
    feature-card.tsx              One planning capability tile
    stat.tsx                      Label / value pair for `<dl>` metric blocks
    badge.tsx                     Status, phase and condition badges
    labels.ts                     Enum -> display label and badge variant maps
    contact-form.tsx              Client component — local state only
    icons.tsx                     Inline SVG icon set (no icon dependency)
    planner/
      building-planner.tsx        Client boundary: state, localStorage and example loading
      building-reducer.ts         Pure reducer for rooms, floors and placed assets
      floor-card.tsx              Floor section and grouped add-room dropdown
      room-card.tsx               Room header, item lists and quantity controls
      asset-picker.tsx            Searchable, category-grouped compatible-item picker
      planner-summary.tsx         Totals, category breakdown and utility requirements
      bill-of-materials.tsx       Aggregated quantity and cost table
  lib/
    types.ts                      Domain types (Facility, Zone, CapitalProject, planner, ...)
    data.ts                       The data-access seam — start here
    format.ts                     Currency, area and percent formatting
    planner.ts                    Compatibility, totals and bill-of-materials helpers
    planner-data/
      index.ts                    Combines room, asset and preset fixtures
      rooms.ts                    Room templates and recommended-setup references
      setups.ts                   Reusable recommended-setup lists and the q() helper
      devices.ts                  Point-of-care devices
      equipment.ts                Major clinical, imaging, surgical and lab equipment
      medical-furniture.ts        Clinical furniture, carts and storage
      non-medical-furniture.ts    Office, waiting, meeting and staff furniture
      machines.ts                 Plant, IT, laundry and back-of-house machinery
      presets.ts                  Example buildings
```

## Domain model

- **`Facility`** — one site: type, status, location, site and floor area,
  licensed beds (`null` for outpatient sites), occupancy, service lines.
- **`Zone`** — a functional area inside a facility: function, area, utilization
  and a facility-condition-index style rating (`good` / `fair` / `poor`).
- **`CapitalProject`** — one project in the roadmap: category, phase, budget,
  start and target year, progress.
- **`RoomTemplate`** — a planner room type: category, default area, patient
  beds, required utilities and a recommended asset setup.
- **`AssetTemplate`** — one of five planner item groups (`device`, `equipment`,
  `medical-furniture`, `non-medical-furniture`, `machine`) with a unit cost,
  utilities, compatible room categories and installation type.
- **`BuildingPlan`** — the client-side plan: named floors, placed rooms and
  quantities of placed assets. It is serialisable so it can be persisted to an
  API later.

Money is stored in **cents**; areas in **square meters**. The sample portfolio is
four Texas sites (hospital, surgical center, outpatient clinic, diagnostic
center) with ten capital projects between them. The planner catalog contains
130 room templates and 248 assets across its five item groups.

## The data layer

Every page reads through the async functions at the bottom of
`src/lib/data.ts`: `getFacilities`, `getFacilityBySlug`, `getCapitalProjects`,
`getPlanningCapabilities`, `getContactDetails` and `getPlannerCatalog`. Today
they return in-memory fixtures. The planner fixtures are split by concern in
`src/lib/planner-data/` and combined into `plannerCatalog`.

To use a real backend, rewrite those function bodies. The pages, components and
types do not need to change. For the planner, keep the `PlannerCatalog` return
shape so the UI and pure calculations in `src/lib/planner.ts` continue to work.

**Prisma + MongoDB**

A schema that matches the current types:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Facility {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  slug              String   @unique
  name              String
  type              String
  status            String
  city              String
  region            String
  openedYear        Int
  siteAreaSqm       Int
  grossFloorAreaSqm Int
  licensedBeds      Int?
  occupancyPct      Int
  summary           String
  serviceLines      String[]
  zones             Zone[]
  projects          CapitalProject[]
}

model Zone {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  name           String
  function       String
  areaSqm        Int
  utilizationPct Int
  condition      String
  facilityId     String   @db.ObjectId
  facility       Facility @relation(fields: [facilityId], references: [id])
}

model CapitalProject {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  name         String
  category     String
  phase        String
  budgetCents  BigInt
  startYear    Int
  targetYear   Int
  progressPct  Int
  description  String
  facilityId   String   @db.ObjectId
  facility     Facility @relation(fields: [facilityId], references: [id])
}
```

Then:

```ts
export async function getFacilities(): Promise<Facility[]> {
  return prisma.facility.findMany({ include: { zones: true, projects: true } });
}
```

The MongoDB provider uses `prisma db push` rather than `migrate dev`, and needs
a replica-set URI (Atlas, or a local replica set). `BigInt` does not serialize
to JSON, so either keep budgets as `Int` or convert with `Number()` before
returning.

**Appwrite**

```ts
import { Client, Databases } from "node-appwrite";

export async function getFacilities(): Promise<Facility[]> {
  const { documents } = await databases.listDocuments(DB_ID, FACILITIES_COLLECTION_ID);
  return documents as unknown as Facility[];
}
```

Note that Prisma does not talk to Appwrite's database directly — Appwrite has
its own SDK. Pick one or the other rather than layering them.

Copy `.env.example` to `.env.local` when you wire either up; `.env.local` is
gitignored, and `.env.example` is committed as documentation of the variables.

## Virtual building planner

`/planner` is an illustrative planning toy for assembling a hospital floor by
floor. A room is added from a grouped dropdown, then equipped from exactly five
item groups:

**devices**, **equipment**, **medical furniture**, **non-medical furniture** and
**machines**.

The catalog covers 15 room categories, from inpatient and critical care through
imaging, laboratories, pharmacy, sterile processing, rehabilitation, support,
administration and plant engineering. Each room template declares its default
area, patient beds, utilities and a recommended setup. Asset compatibility is
data-driven: every asset lists the room categories it belongs in, and `"all"` is
reserved for genuinely universal items such as waste bins or sharps holders.

The summary panel totals patient beds, area, item quantities, estimated asset
cost, category spend and the building services the plan requires. The bill of
materials aggregates every placed item across rooms, with quantities, unit costs
and extended costs.

### Persistence and examples

- State is held in the `BuildingPlanner` client component and autosaved to
  `joehealthplan.virtual-building.v1` in `localStorage`.
- Reloading restores the saved plan. **Reset** clears it.
- **Load example** replaces the plan after confirmation using one of the presets
  in `src/lib/planner-data/presets.ts`.
- Room, asset and floor IDs are generated only in event handlers. This matters
  because `crypto.randomUUID()` and `Math.random()` throw during prerendering
  with `cacheComponents`.

### Adding catalog data

1. Add an `AssetTemplate` to the matching file in `src/lib/planner-data/` with a
   unique kebab-case `id`, unit cost in cents, utilities, installation type and
   compatible room categories.
2. Add or reuse a recommended setup in `setups.ts` using `q("asset-id", qty)`.
3. Add a `RoomTemplate` to `rooms.ts` with its category, default area, patient
   beds, utilities and `recommendedSetup`.
4. Update `presets.ts` only if the example hospital should include the new room.
5. Verify every recommended asset ID and preset room ID resolves, then run lint,
   type-check and build.

Costs, utilities, room sizes and recommended setups are mock values for
demonstration. They are **not** procurement, engineering or clinical guidance.

## Things to know about this Next.js version

Next.js 16 with `cacheComponents: true` in `next.config.ts` changes a few rules
worth knowing before you add code:

- **No `dynamic`, `revalidate`, `fetchCache` or `dynamicParams` segment configs.**
  They fail the build. Caching is opt-in with the `"use cache"` directive, and
  lifetimes come from `cacheLife`.
- **Data is uncached by default**, so nothing is stale unless you ask for it.
- **Synchronous IO is rejected during prerendering.** `new Date()`,
  `Date.now()`, `Math.random()` and `crypto.randomUUID()` throw in a prerendered
  shell. That is why the footer's `COPYRIGHT_YEAR` is a constant.
- **`generateStaticParams` must return at least one param.** An empty array is a
  build error, which is why `facilities/[slug]` returns every facility slug.
- **Runtime data needs a `<Suspense>` boundary.** Reading `cookies()`,
  `headers()` or `searchParams` at the top of a page raises a validation error
  instead of silently making the route dynamic.
- The project ships the Next.js docs in `node_modules/next/dist/docs/`, and
  `AGENTS.md` points coding agents at them.

## Suggested next steps

1. Add `app/api/facilities/route.ts` if a client-rendered surface needs the data.
2. Wire the contact form to a Server Action and persist submissions.
3. Add create/edit flows for zones and projects — these need `"use cache"` plus
   `cacheTag`/`updateTag` so lists refresh after a mutation.
4. Track history per project (phase transitions, budget revisions) instead of
   the single `progressPct` snapshot.
5. Add auth and per-site permissions once there is a backend to enforce them.
6. Move `getPlannerCatalog()` and saved `BuildingPlan` records behind an API so
   plans can be shared between users instead of living only in one browser.
7. Add plan versioning and comments for design reviews, plus export to CSV or
   PDF for the bill of materials.
