# Component Inventory

This file is the project memory for reusable UI components. Check it and inspect the source before implementing a new component. Update it whenever the reusable component set changes.

## Current inventory

- **QuickDemo — `features/quick-demo/quick-demo.tsx`:** Self-contained, Spanish-language 90-second commercial-flow simulator used by `/demo`. Takes no props; owns one in-memory reducer shared by visible buyer, importer and CoBusiness administration role views. Role changes preserve all progress; role-specific controls and reducer gates separate contributions/refund claims, importer decisions and administration authorization/refund eligibility. Includes scenario presets, actual-amount simulated refunds, activity and full reset. Reuses global design tokens and local fonts. Do not use it for real payments or authorization; deliberately does not reuse `DemoShell`, whose authentication, storage, and wallet-oriented workspace would add unnecessary prerequisites.
- **DemoShell — `shared/ui/demo-shell.tsx`:** Provides the demo workspace header, role selector, simulated session guard and sign-out, client data provider, storage error recovery, and explicit reset control. Accepts page content as `children`; use only inside the simulated workspace.
- **AuthForm — `features/auth/auth-form.tsx`:** Shared simulated sign-in and registration form. The `mode` selects copy and links; validates credentials locally and selects a demo role. Requires `AuthProvider` and must not be used for real authentication.
- **Icon — `app/page.tsx`:** Small decorative line icons used by the landing page. API: `name` selects a supported geometric icon; `className` sets its size and style. Icons are hidden from assistive technology and must not replace labels or meaningful content.
- **RoadmapCard — `app/page.tsx`:** Presents one planned product phase. API: `phase` supplies the phase name, status, summary, optional compact summary lines, feature list and optional condition; `compact` selects the first-screen preview layout. Use the detailed layout for roadmap content and compact layout only for the landing overview. Phase status and feature copy must remain aligned with `PRODUCT.md` and must not imply unimplemented capabilities are live.

## Adding an entry

For each reusable component, record:

- **Name and source:** component name and source path.
- **Purpose:** the job it serves and where it is used.
- **API:** key props, variants, and state behavior.
- **Reuse guidance:** when to use it and any known limitations.
