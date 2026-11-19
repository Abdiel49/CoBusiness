---
name: CoBusiness
description: A clear B2B visual system for explaining collective purchasing in Bolivia.
colors:
  page: "#f5f7f7"
  surface: "#ffffff"
  ink: "#09090c"
  body: "#393d4c"
  muted: "#555b69"
  line: "#d9e0e8"
  blue: "#0c57de"
  blue-dark: "#0848bf"
  blue-wash: "#edf4ff"
  green: "#138258"
  green-wash: "#eff9f4"
  red: "#c83f49"
  red-wash: "#fff2f1"
  conditional-wash: "#fff4dc"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "clamp(2.4rem, 3.86vw, 57.5px)"
    fontWeight: 700
    lineHeight: 0.99
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "23px"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Atkinson Hyperlegible, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 700
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "13px 16px"
  button-primary-hover:
    backgroundColor: "{colors.blue-dark}"
    textColor: "#ffffff"
  offer-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  roadmap-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "13px"
    padding: "15px 16px 13px"
  status-chip:
    backgroundColor: "#edf0f4"
    textColor: "#3c4654"
    rounded: "9px"
    padding: "3px 9px"
---

# Design System: CoBusiness

## Overview

**Creative North Star: "The Collective Order Ledger"**

The page treats the collective order as the clearest visual explanation of the product: separate buyers are shown joining into one demand signal, which is compared with an operator's MOQ. The atmosphere is conventional and businesslike, with open white surfaces, near-black text, a restrained blue action color, and compact neutral borders. Atkinson Hyperlegible keeps the Spanish copy direct and legible across dense commercial conditions.

The offer panel and roadmap use structured rows and compact cards to make roles, thresholds, conditions, and planned scope easy to scan. Blue is the main interaction and organization color; green and red distinguish the two conditional outcome paths. The page states that the flow is illustrative, planned for Stellar Testnet, and uses no real customer funds. It does not present the roadmap as shipped functionality or claim business results.

**Key Characteristics:**
- Blue-centered, light neutral palette.
- Offer-led information hierarchy with clear commercial conditions.
- Restrained borders and limited card use.
- Spanish-language, B2B-first content for Bolivia.
- Explicit distinction between illustrative MVP scope and real activity.

## Colors

The palette pairs a strong working blue with near-white surfaces and dark, readable text; green and red are reserved for outcome meaning.

### Primary
- **Working Blue**: the main action, brand mark, links, icons, and progress emphasis.
- **Deep Blue**: the hover state for primary actions.
- **Blue Wash**: quiet emphasis behind MVP and illustrative flow information.

### Neutral
- **Cool Page**: the page canvas.
- **White Surface**: offer and roadmap card surfaces.
- **Near-Black Ink**: headlines and primary text.
- **Slate Body**: explanatory copy.
- **Muted Slate**: supporting labels and footer copy.
- **Compact Border**: dividers and neutral card outlines.

### Semantic
- **Success Green** and **Success Wash**: the conditional success outcome.
- **Refund Red** and **Refund Wash**: the eligible-refund outcome.
- **Conditional Amber Wash**: the conditional roadmap status and prerequisite notice.

**The State-Meaning Rule.** Keep green and red attached to their respective conditional outcomes. They are status cues, not competing brand accents.

## Typography

**Display Font:** Atkinson Hyperlegible (with Arial, sans-serif fallback)
**Body Font:** Atkinson Hyperlegible (with Arial, sans-serif fallback)
**Label/Mono Font:** No separate label or monospaced family is used.

**Character:** One highly legible sans-serif family keeps display, body, and label language coherent. Bold weight and tight headline tracking create hierarchy without introducing a decorative display face.

### Hierarchy
- **Display** (700, responsive 2.4rem to 57.5px, 0.99 line-height): the main hero statement.
- **Headline** (700, responsive 2rem to 3.6rem, 1.04 line-height): major explanatory section headings.
- **Title** (700, 23px, 1.15 line-height): workflow and content titles; smaller card titles scale down responsively.
- **Body** (400, 16px, 1.5 line-height): default explanatory copy; narrower measures are used for long-form descriptions.
- **Label** (700, 14px): role labels, workflow labels, and small metadata.

## Layout

At wide desktop sizes, the first screen is a fixed-ratio composition (1487:1058) with a slim navigation row, a two-column hero, a large illustrative order panel, and a four-stage roadmap preview. The offer panel receives the largest visual area because it explains how buyers combine demand toward the MOQ. The rest of the page uses a centered content column capped at 1320px, generous section spacing (112px), and structured grids or ruled lists instead of repeated boxed cards.

At 1120px and below, the first screen becomes a normal vertical flow and its hero remains two columns while space allows. At 760px and below, the hero and roadmap stack, buyer examples become full-width rows, workflow and roadmap detail become single-column, and section spacing contracts to 76px. Keep the actual breakpoint behavior and content order intact when extending the page. The responsive layout is deliberately readable rather than dashboard-dense.

## Elevation & Depth

The system is mostly flat. Borders, pale blue section washes, and semantic outcome surfaces establish grouping; the only broad tonal treatment is the blue-tinted MVP section. The MVP section's zero-blur spread shadow extends its background to the viewport edge and does not create elevation. No component shadow vocabulary is used. Do not add elevation for decoration when a border or surface shift already establishes structure.

## Shapes

Corners are gently rounded and compact: offer panels use 16px corners at desktop and 13px on small screens; buttons use 11px; buyer and demand rows use 12px; roadmap cards use 13px; small status notices range from 8px to 10px. Thin neutral borders define cards and rows. The main order diagram uses direct connectors and simple icons rather than ornamental geometry.

## Components

### Buttons
- **Character:** compact, confident, and clearly actionable.
- **Primary:** blue fill, white bold text, 11px corners, and a small inline arrow on the navigation action. At tablet size the measured padding is 13px 16px; the hero action is sized to its text with 23px horizontal padding.
- **Hover / Focus:** hover shifts to deep blue and lifts by 1px. Focus-visible links use a 3px blue outline with a 4px offset.
- **Other variants:** no secondary button variant is present.

### Cards / Containers
- **Offer panel:** white, thin neutral border, 16px corners, with 24px internal padding at tablet and 17px on mobile. It contains the illustrative participants, combined demand, MOQ, and conditional outcomes.
- **Roadmap preview cards:** white with a thin neutral border, 13px corners, and 15px 16px padding. The MVP card alone receives a blue border and pale blue fill.
- **Depth:** flat; see Elevation & Depth.

### Chips
- **Status:** compact gray fill with dark slate text for planned stages; conditional status uses an amber wash and darker amber text. Corners are 9px.

### Navigation
- **Style:** a slim wordmark and three anchor links; bold Atkinson Hyperlegible, with no enclosing navigation container.
- **Hover / Focus:** links underline on hover; keyboard focus has a visible blue outline.
- **Mobile:** navigation moves to a second row under the brand and action.

### Collective Order Diagram
The signature panel moves from buyer rows through a joining connector to combined demand and the operator's MOQ, then separates the two conditional outcomes. Keep its data explicitly illustrative and preserve the Testnet/no-real-funds disclosure wherever this pattern is reused.

## Do's and Don'ts

### Do:
- **Do** use blue for primary actions and the key demand-aggregation path.
- **Do** use compact borders and pale surface shifts to group information.
- **Do** keep text in Atkinson Hyperlegible and reserve bold weight for hierarchy and labels.
- **Do** state when an order example is illustrative and when funds are simulated.
- **Do** retain the stacked single-column behavior at the mobile breakpoint.

### Don't:
- **Don't** present illustrative participants, progress, or outcomes as real transaction evidence.
- **Don't** imply that planned roadmap features are already available.
- **Don't** imply real customer funds are accepted in the Testnet MVP.
- **Don't** use green or red as general decorative accents.
