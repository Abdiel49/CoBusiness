# Component Inventory

This file is the project memory for reusable UI components. Check it and inspect the source before implementing a new component. Update it whenever the reusable component set changes.

## Current inventory

- **Icon — `app/page.tsx`:** Small decorative line icons used by the landing page. API: `name` selects a supported geometric icon; `className` sets its size and style. Icons are hidden from assistive technology and must not replace labels or meaningful content.
- **RoadmapCard — `app/page.tsx`:** Presents one planned product phase. API: `phase` supplies the phase name, status, summary, optional compact summary lines, feature list and optional condition; `compact` selects the first-screen preview layout. Use the detailed layout for roadmap content and compact layout only for the landing overview. Phase status and feature copy must remain aligned with `PRODUCT.md` and must not imply unimplemented capabilities are live.

## Adding an entry

For each reusable component, record:

- **Name and source:** component name and source path.
- **Purpose:** the job it serves and where it is used.
- **API:** key props, variants, and state behavior.
- **Reuse guidance:** when to use it and any known limitations.
