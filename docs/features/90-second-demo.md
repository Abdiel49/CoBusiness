# 90-second commercial-flow demo

## User-visible behavior

The landing page's existing primary header action now reads **Probar demo** and opens `/demo`. All other landing content, layout and branding remain unchanged. `/demo` is a public, standalone, Spanish-language simulator. It inherits CoBusiness colors, local Atkinson Hyperlegible fonts, flat surfaces, rounded controls and the existing brand symbol.

A persistent simulation notice explicitly identifies fictional data and the absence of real money, backend, wallet or blockchain. Commercial status and simulated financial status are displayed separately. A visible role selector switches between **COMPRADOR**, **IMPORTADOR** and **ADMINISTRACIÓN COBUSINESS** without resetting quantities, accepted conditions, contributions, balances, stage or activity. These are simulated role views, not authenticated permissions. All views share the offer, conditions, status, balances and activity; actions belonging to other roles are hidden, with guidance naming the next required role. The reducer independently gates each role's actions.

## Fictional data and contracts

- One fictional importer and one offer: 1,000 stainless steel thermoses, 750 ml.
- Ten blocks of 100 units; Bs 50 per unit, Bs 5,000 per block, Bs 50,000 goal.
- Success starts with seven blocks funded by other fictional buyers.
- Rejection starts fully funded, including one precached buyer block worth Bs 5,000.
- Illustrative commercial terms: full minimum required; pickup in La Paz 30 days after simulated payout; importer handles supply and delivery; no demo fees; importer rejection cancels purchase and enables full individual contribution refunds.

Constants and transition rules live in `domain/demo/quick-demo.ts`; these are demonstration choices, not real prices, API schemas, legal terms or production guarantees. There are no API requests, route handlers, database, wallet calls, blockchain transactions or additional dependencies. The route does not use the existing authenticated demo workspace or its persistent data. React `useReducer` state is isolated to this page and resets on reload.

## Flows and states

### Successful purchase

1. Select one to three available blocks; the contribution total updates immediately.
2. Accept the visible fictional offer conditions. Contribution remains disabled until accepted.
3. Simulate contribution. Confirmed contribution and funding progress update; duplicate contributions are blocked.
4. If fewer than three blocks were selected, use **Simular aportes restantes** to reach the goal. Selecting all three reaches the goal immediately.
5. Switch to **IMPORTADOR** and ratify. Fully funded does not imply release authorization. The importer may instead reject any funded offer, regardless of the initial scenario preset.
6. Switch to **ADMINISTRACIÓN COBUSINESS** and authorize. Authorization still does not move the simulated balance.
7. Simulate payout. Held balance becomes zero; procurement remains pending, not delivered.

### Importer rejection

1. Choose **Rechazo y devolución**. The offer is already fully funded.
2. Switch to **IMPORTADOR** and reject; no payout occurs. Both ratification and rejection are available once funded, including in this preset.
3. Switch to **ADMINISTRACIÓN COBUSINESS** and enable simulated refunds.
4. Switch to **COMPRADOR** and claim the demo buyer's Bs 5,000. Mark this buyer's refund completed; retained balance becomes Bs 45,000 because other buyers have separate claims. Rejection after a new buyer contribution also works: the claim label, returned amount and retained balance use the actual contributed blocks (for example, two blocks return Bs 10,000 and leave Bs 40,000 held).

Both scenarios expose a restart action at any point and a direct alternate-scenario action at completion. Changing scenario reconstructs all state, including quantities, acceptance, confirmed funds, stage and activity, and restores the buyer view. Changing role alone never restarts. No timers or network waits can race a restart. Invalid/out-of-sequence actions, actions from the wrong simulated role and repeat payouts/refunds are reducer no-ops. Activity is announced through a polite live region and displayed as a readable history.

## Suggested 90-second recording

- 0–10s: landing **Probar demo**, simulation notice and fictional offer.
- 10–30s: choose a block, accept terms, contribute, complete remaining contributions.
- 30–55s: explain separate states, switch to importer and ratify, switch to administration, authorize and simulate payout.
- 55–80s: switch to rejection preset, select importer and reject, select administration and enable refund, select buyer and claim contribution.
- 80–90s: show completed refund, retained remainder and restart.

## Configuration and verification

Run `npm ci`, `npm run build`, then `npm run start -- --port 3010`; no environment variables or services are required for `/demo`.

- Production build succeeded with `/demo` statically prerendered.
- `npm run typecheck` passed after Next generated its framework type declarations. The first pre-build check reported the existing `app/layout.tsx` `Cannot find name 'LayoutProps'`; building generated the missing declaration without changing that file.
- `npm test`: 43 tests passed, including five new reducer tests covering both complete paths, terms gating, quantity validation, duplicate protection, authorization prerequisites and reset/scenario isolation.
- `npm run lint`: zero errors; 279 pre-existing warnings in bundled Impeccable script copies, not application files.
- External Playwright/Chromium is used for browser checks without adding project dependencies. Initial screenshots at 1440×900, 1280×720 and 390×844 confirmed the inherited visual world and no mobile horizontal overflow. The first 1280×720 capture exposed a contribution button below the viewport; vertical spacing was reduced before the final verification round.
- Browser interaction checks passed both complete paths on desktop and mobile, required-terms gating, selecting all remaining blocks, reset immediately after contribution, rejection reset, scenario isolation, no horizontal overflow, and zero JavaScript page errors. Observed fetches were Next.js landing-route prefetches only, not API requests. A dedicated short-desktop-height compact rule brings the initial CTA fully into view: independent final QA measured y=617.17 and height=50 at 1280×720.
- Impeccable's mechanical detector ran on changed UI sources. Findings were advisory palette/type/radius ramp differences only, primarily compact operational UI sizing and semantic tonal variants; no hard violations were reported.
- The primary agent independently reran the final production build (Next.js 16.4.6, static `/demo`), TypeScript, all 43 tests and lint successfully. Its stable verification server used `http://127.0.0.1:3020`.
- Independent browser QA passed both complete flows and balances, two/three-block selections, terms gating, resets, scenario changes and reload. There was no horizontal overflow at 320, 390, 768, 1280 or 1440 pixels and no JavaScript, console, HTTP, API or external-request errors. The script is `/tmp/opencode/browser-verification/independent-qa.cjs`; the final report and five screenshots are in `/tmp/opencode/browser-verification/independent-qa-artifacts/2026-11-22T15-07-25-014Z/` (local verification artifacts, not repository dependencies).
- Independent reviewer session `ses_dfc333a4dffektxr3RQDXuJWvL` inspected the five screenshots and implementation and returned **SHIP**, with no P0/P1 findings and material brief/craft-floor compliance. A refund capture showed the focused skip link; this is non-blocking keyboard behavior. Remove focus before recording if that presentation detail is unwanted.
- An earlier browser attempt on port 3010 reported `net::ERR_CONNECTION_REFUSED` while its server was shutting down. This was resolved by rerunning independent QA against the stable port-3020 server; it was not an interface failure.

## Limitations and pending integrations

### Role-correction verification (supersedes earlier no-selector verification)

- `npm run build`: passed, Next.js 16.4.6, `/demo` statically prerendered.
- `npm run typecheck`: passed.
- `npm test`: 46 tests passed, including eight quick-demo tests for both paths, shared state on role changes, wrong-role no-ops, actual contribution refunds and reset.
- `npm run lint`: zero errors; the same 279 existing bundled-tool warnings.
- External Playwright/Chromium script `/tmp/opencode/browser-verification/role-qa.cjs` passed both complete flows at 1280px and 390px, role visibility and approval gates, acceptance/quantity preservation on role switches, two-block refund amounts, precached rejection, reset and zero JavaScript page errors. Initial captures show no horizontal overflow at 320, 390, 768, 1280 and 1440px. Rendered 1280px/390px captures were inspected together; the inherited design is preserved. The additional role controls mean the initial contribution button requires a small vertical scroll at 1280×720; mobile retains the existing stacked offer/action layout. For recording without this scroll, use a taller desktop viewport.
- Screenshots: `/tmp/opencode/browser-verification/role-artifacts/` (local verification artifacts only).
- Impeccable setup ran once with `/demo` and again exposed the known filesystem-target interpretation; real `PRODUCT.md`, `DESIGN.md`, the existing surface brief and the hardening/craft references were inspected directly. The mechanical detector ran once on changed UI files, reporting only advisory existing palette/type/radius differences and no hard violations.
- The correction does not change the landing page, route, authentication workspace, API, dependencies or external integrations. No push or pull request is performed, per the explicit task restriction.

This is an intentionally local presentation demo, not the Stellar MVP described in the roadmap. It has no secure authorization, authenticated roles, persistent order, actual escrow, production finance, shipping, refund processing, or transaction proof. Refresh discards progress. Do not use with real funds or imply commercial validation. All financial checks are client-side storytelling constraints, not security guarantees.

`npm ci` reported three dependency vulnerabilities (one moderate, two critical). Dependency upgrades were not applied because they are outside this feature and could require breaking changes; inspect with `npm audit` and address separately.

The first Impeccable context call used `--target /demo`, which incorrectly resolved `projectRoot=/demo` and reported `NO_PRODUCT_MD`; `PRODUCT.md` and `DESIGN.md` were read directly from the real repository instead. The pinned request and incumbent design were used without inventing missing product context. Independent final browser QA and a SHIP review were completed before the authorized local feature commit. No push or pull request is requested or performed.
