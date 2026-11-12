<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# JoeHealthPlan — engineering guide

## What this project is

JoeHealthPlan is a healthcare facility master-planning and capital-program site
with an interactive **virtual hospital building planner** at `/planner`.

Stack: Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4.
There is no UI component library and no 3D library; use the existing Tailwind
tokens and inline SVG icons.

## Commands

| Command             | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Development server               |
| `npm run lint`      | ESLint                           |
| `npx tsc --noEmit`  | Type-check without emitting      |
| `npm run build`     | Production build / prerender check |
| `npm run db:migrate`| Create and apply a Prisma migration |
| `npm run db:seed`   | Re-seed reference data           |
| `npm run db:studio` | Open Prisma Studio               |

Run lint, type-check and build before considering a change finished.

## Data layer

- Every page reads through the async accessors in `src/lib/data.ts`:
  `getFacilities`, `getFacilityBySlug`, `getCapitalProjects`,
  `getPlanningCapabilities`, `getContactDetails` and `getPlannerCatalog`.
- Facilities, capital projects and the planner catalog come from Postgres
  (Neon) through Prisma (`src/lib/db.ts`). Capabilities and contact details are
  still static copy.
- Pages and components must not import fixtures or Prisma directly. Extend the
  accessors in `src/lib/data.ts` and keep the return types in
  `src/lib/types.ts` stable.
- The database-backed getters use `"use cache"` with `cacheLife` and
  `cacheTag`. Tags are `facilities`, `facility-<slug>`, `projects` and
  `planner-catalog`; invalidate them after mutations.
- Cached return values must be serializable. Mappers convert Prisma records
  to plain domain objects and Postgres `BIGINT` budgets to `number`.
- Money is stored in **cents**; areas are stored in **square meters**.
- The planner catalog seed data lives in `src/lib/planner-data/`:
  - `rooms.ts` — room templates grouped by the 15 room categories
  - `setups.ts` — reusable recommended-setup lists and the `q()` helper
  - `devices.ts`, `equipment.ts`, `medical-furniture.ts`,
    `non-medical-furniture.ts`, `machines.ts` — the five asset groups
  - `presets.ts` — example buildings
  - `index.ts` — combines everything into `plannerCatalog`
- Facility fixtures live in `src/lib/fixtures/facilities.ts` and are seed input
  only. `prisma/seed.ts` is idempotent and replaces reference data.
- Pure planner logic belongs in `src/lib/planner.ts` (compatibility, totals,
  bill of materials, category ordering). Keep UI components free of duplicated
  calculation logic.

## Planner conventions

- The five asset categories are exactly: `device`, `equipment`,
  `medical-furniture`, `non-medical-furniture`, `machine`.
- Room compatibility is data-driven through `AssetTemplate.roomCategories`.
  Use `"all"` only for genuinely universal items such as waste bins, sharps
  holders or Wi-Fi access points.
- Recommended setups live on room templates and reference asset IDs. Add new
  entries through `setups.ts` so recommendations stay reusable.
- Catalog IDs are stable strings and should read as kebab-case identifiers.
  After adding data, verify that every recommended asset ID exists and every
  preset room template ID exists.
- The planner is illustrative. Do not present costs, utilities, recommended
  setups or room sizes as procurement or clinical guidance.
- Planner state is client-side and autosaved to
  `joehealthplan.virtual-building.v1` in localStorage. State types are in
  `src/lib/types.ts` and are designed to be serialized to a future API.
- Generate room, asset and floor IDs only inside event handlers. The README
  explains why synchronous random IDs cannot run during prerendering.

## Adding catalog data

1. Add the asset to the matching file in `src/lib/planner-data/` with a unique
   `id`, category, description, unit cost in cents, utilities, compatible room
   categories and installation type.
2. Add or reuse a setup in `setups.ts` using `q("asset-id", quantity)`.
3. Add the room template to `rooms.ts` with the correct category, area, patient
   beds, utilities and `recommendedSetup`.
4. Add it to a preset in `presets.ts` only if the example building should show
   it.
5. Run `npm run db:seed` to refresh the catalog tables, then lint, type-check and
   build.

## Next.js 16 constraints in this repo

`next.config.ts` enables `cacheComponents` and `partialPrefetching`.

- Do **not** add `dynamic`, `revalidate`, `fetchCache` or `dynamicParams`
  segment configs; they fail the build.
- Synchronous IO is rejected during prerendering: `new Date()`, `Date.now()`,
  `Math.random()` and `crypto.randomUUID()` must not run in render or module
  scope. Use static constants or generate values in event handlers.
- Runtime data reads (`cookies()`, `headers()`, `searchParams`) need a
  `<Suspense>` boundary.
- `generateStaticParams` must return at least one param.
- `"use client"` is declared at the interactive boundary
  (`building-planner.tsx`); components imported by it inherit the client graph.
- Cached getters (`"use cache"`) must return serializable values. Do not return
  Prisma records, `BigInt`, `Date`, class instances or functions; map to plain
  objects first.
- `npm run build` needs a reachable, seeded database because the data getters
  are prerendered.
- Read the relevant guide in `node_modules/next/dist/docs/` before changing
  routing, caching or data-fetching behaviour.

## Styling and UI conventions

- Use the semantic Tailwind tokens from `src/app/globals.css`: `bg-background`,
  `bg-card`, `bg-muted`, `border-border`, `text-foreground`,
  `text-muted-foreground`, `text-brand`, `bg-brand-soft`, `text-crit`, etc.
- Match the existing visual language: `rounded-2xl` cards, `border-border`,
  compact badges, `text-sm`/`text-xs` helper copy and a single brand accent.
- Prefer native controls (`select`, `input`, `details`, `button`) for
  accessibility; add visible `focus-visible:ring-2 focus-visible:ring-brand`
  styles to new interactive elements.
- Do not add a UI or state-management dependency for the planner without
  discussing it first.

## Verification checklist for planner changes

- `/planner` renders and the header/footer links work.
- Adding a room places it on the chosen floor and resets the dropdown.
- Only compatible assets appear in a room’s picker.
- Quantities, room totals, building summary and bill of materials agree.
- Reloading restores the saved building; Reset clears it.
- Load example replaces the building after confirmation.
- Empty states, mobile stacking and dark mode look correct.
- No hydration warnings and no synchronous random IDs during prerender.
