# Interactive collective purchase demonstration

## Scope and behavior

The current scope is an interactive product demonstration. Authentication, roles, and identity verification are deferred by the current product decision, although `PRODUCT.md` includes them in its broader roadmap.

The landing page links to `/identidad`. The page explains three stages of a collective purchase: offer, collective goal, and possible outcome. Selecting a stage updates its description locally, and a link returns to the landing page. The content is illustrative; the page does not create purchases, collect payments, or submit transactions.

## Data and integration

The demonstration uses local static content and client-side selection. It makes no API or Stellar calls and requires no environment configuration. Actual offer data, order creation, wallet interactions, and financial outcomes remain future integration work. The goal being reached does not itself authorize fund release.

## Verification and limitations

The landing page passed the Impeccable responsive gate and was recorded as ready to ship. The demonstration's initial state was inspected on desktop and mobile. A Playwright check at 390px verified the landing link, all three stage buttons and their titles and `aria-pressed` states, and the return to `/`. The interactive states have not yet been visually inspected. This demonstration does not establish the identity, authorization, or Testnet financial acceptance criteria originally specified for F02.
