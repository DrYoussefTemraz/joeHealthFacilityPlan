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
    contact/actions.ts            Server Action: validate + save review requests
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
    contact-form.tsx              Client form — Server Action + inline field errors
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
    data.ts                       Cached read layer + review-request mutation
    db.ts                         Prisma client singleton
    review-request.ts             Topic options and shared form state types
    fixtures/
      facilities.ts               Portfolio seed data (not read by pages)
    format.ts                     Currency, area and percent formatting
    planner.ts                    Compatibility, totals and bill-of-materials helpers
    planner-data/
      index.ts                    Combines room, asset and preset seed data
      rooms.ts                    Room templates and recommended-setup references
      setups.ts                   Reusable recommended-setup lists and the q() helper
      devices.ts                  Point-of-care devices
      equipment.ts                Major clinical, imaging, surgical and lab equipment
      medical-furniture.ts        Clinical furniture, carts and storage
      non-medical-furniture.ts    Office, waiting, meeting and staff furniture
      machines.ts                 Plant, IT, laundry and back-of-house machinery
      presets.ts                  Example buildings
prisma/
  data/
    catalog-assets-priced.csv     USD planning prices applied to the catalog
    catalog-assets-sources.csv    EGP ranges, FX, confidence and source notes
  schema.prisma                   Postgres schema (facilities, projects, catalog, requests)
  seed.ts                         Idempotent seed from fixtures + planner data + price overlay
  migrations/                     Applied SQL migrations
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

Every page reads through the async functions in `src/lib/data.ts`:
`getFacilities`, `getFacilityBySlug`, `getCapitalProjects`,
`getPlanningCapabilities`, `getContactDetails` and `getPlannerCatalog`.

Facilities, capital projects and the planner catalog are stored in Postgres
(Neon) and read through Prisma. Planning capabilities and contact details are
still static copy. Pages and components never import fixtures or Prisma
directly; keep the return types in `src/lib/types.ts` unchanged when the
queries evolve.

The database-backed getters are wrapped in `"use cache"` with `cacheLife` and
`cacheTag`, so prerendered pages can include the data without a request-time
query. Tags are `facilities`, `facility-<slug>`, `projects` and
`planner-catalog`. The mappers return plain objects because cached values must
be serializable; `CapitalProject.budgetCents` is a Postgres `BIGINT` converted
to a number.

Asset structure still comes from `src/lib/planner-data/`. Unit prices are
overlaid from `prisma/data/catalog-assets-priced.csv`; the matching
`catalog-assets-sources.csv` carries the EGP ranges, FX rate, confidence and
source notes. The seed matches both files by asset ID and refuses to run if any
ID is missing, duplicated or unknown. The USD values in the database are
planning estimates, not verified procurement quotations. The current baseline
has 247 low-confidence expert estimates and one medium-confidence historical
benchmark.

### Local database setup

1. Copy `.env.example` to `.env` and paste the Neon **direct** (non-pooler)
   connection string into `DATABASE_URL`. Keep the pooled string for the
   deployed runtime, but migrations and seeds use the direct one. `.env` is
   gitignored; never commit real credentials.
2. Apply the migrations and seed the reference data:

   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

3. `npm run db:studio` opens Prisma Studio if you want to inspect rows.

The seed is idempotent. It replaces reference data (the catalog and each
facility's zones and projects), so re-running it is safe while no user-owned
rows reference those records.

### Schema notes

- Facility slugs are the primary key; zones and projects reference them.
- Enum-like fields are strings matching the unions in `src/lib/types.ts`.
  Validation stays in TypeScript for now.
- Project budgets are `BIGINT` because some portfolio values exceed the
  32-bit `integer` range.
- Asset unit costs stay `integer` USD cents. The price overlay also stores
  `priceConfidence`, source type/title/publisher/URL, the checked date and the
  cost basis so preliminary estimates are auditable in Prisma Studio.
- Catalog ordering is stored explicitly (`sortOrder`) so recommended setups,
  rooms and presets come back in the same order as the fixtures.
- `"use cache"` cannot serialize Prisma records, `BigInt` or `Date`; the
  mappers in `src/lib/data.ts` convert to domain shapes first.

## Review requests

The contact form at `/contact` is a Server Action, not a client-only
placeholder. `submitReviewRequest` in `src/app/contact/actions.ts` validates
the fields on the server (required values, email format, topic whitelist and
length limits), then calls `createReviewRequest()` in `src/lib/data.ts`.

The client uses React's `useActionState` to show pending, field-error and
success states. Native `required`, `type="email"`, `minLength` and `maxLength`
attributes provide fast feedback; the server checks remain the source of truth.
A hidden honeypot field silently discards basic bot submissions.

Submissions are stored in the `ReviewRequest` table (status defaults to
`new`). They are user data: do **not** wrap the list in `"use cache"` or add a
public page for them. To view and triage them locally:

```bash
npm run db:studio
```

Open the `ReviewRequest` model. For production, add an authenticated admin page
or a notification email instead of exposing the table.

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
   unique kebab-case `id`, a fallback unit cost in cents, utilities,
   installation type and compatible room categories.
2. Add or reuse a recommended setup in `setups.ts` using `q("asset-id", qty)`.
3. Add a `RoomTemplate` to `rooms.ts` with its category, default area, patient
   beds, utilities and `recommendedSetup`.
4. Update `presets.ts` only if the example hospital should include the new room.
5. Add one row for the new `id` to both
   `prisma/data/catalog-assets-priced.csv` and
   `prisma/data/catalog-assets-sources.csv`.
6. Verify every recommended asset ID and preset room ID resolves, then run
   `npm run db:seed`, lint, type-check and build.

Costs, utilities, room sizes and recommended setups are planning inputs for
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

1. Add Server Actions for facilities, zones and projects, and invalidate the
   matching `cacheTag`s after each mutation.
2. Persist `BuildingPlan` records in Postgres (a `Plan` table keyed by user)
   instead of leaving them in one browser's localStorage.
3. Add an authenticated admin view (or a notification email) for review
   requests, and keep the list uncached.
4. Add auth and per-site permissions before exposing write endpoints.
5. Track history per project (phase transitions, budget revisions) instead of
   the single `progressPct` snapshot.
6. Add plan versioning and comments for design reviews, plus export to CSV or
   PDF for the bill of materials.
