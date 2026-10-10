# Design

## Context

Brewcolator is currently a bare React 19 + Vite + TypeScript application running on Bun. To fulfill the feature specifications for the Outcome Predictor and Chaptalization Booster, the application needs a dedicated calculation domain, an architectural shell for client-side routing, and a component system implementing a Swiss-inspired typography aesthetic.

See `proposal.md` for background and problem motivation.

## Goals / Non-Goals

**Goals:**
- Provide pure, thoroughly testable brewing math functions isolated from UI rendering.
- Build an aesthetic Swiss typography interface (18px base, high contrast, tabular numbers) using `@mantine/core` v7 with zero to minimal custom CSS.
- Provide bookmarkable URL routing (`/predict` and `/boost`) using lightweight `wouter`.
- Persist preferences (units, default dry FG, color scheme) to `localStorage` with `jotai` atoms.
- Support seamless US Customary $\leftrightarrow$ Metric conversions.

**Non-Goals:**
- Beer mashing calculations (mash efficiency, strike water temp, SRM/EBC, IBU hopping).
- Multi-step fermentation stages, step-feeding schedules, or nutrient additions (SNA).
- Modeling fluid displacement from dissolved sugars (explicitly disclaimed in the UI).
- Backend servers, user authentication, or cloud database storage.

## Decisions

### 1. Calculation Engine as Pure Functions
- **Choice**: Implement calculation logic as standalone, pure TypeScript modules (`src/lib/brewing-math.ts`) with typed input and output objects.
- **Formulas**:
  - Potential ABV: $(\text{OG} - \text{Dry FG}) \times 131.25$
  - Stalled FG: $\text{OG} - \left(\frac{\text{Tolerance}}{131.25}\right)$
  - Target OG: $\text{Dry FG} + \left(\frac{\text{Target ABV}}{131.25}\right)$
  - Points Deficit: $(\text{Target OG} - \text{Current OG}) \times 1000 \times \text{Batch Volume}$
  - Sugar Weight: $\frac{\text{Total Points}}{\text{PPG}}$
- **Rationale**: Isolating math from React allows unit testing, avoids render cycle bugs, and keeps form handlers thin.
- **Alternatives considered**: Co-locating math in component state hooks (messy and difficult to test).

### 2. UI Component Library: Mantine v7
- **Choice**: `@mantine/core` and `@mantine/hooks`.
- **Rationale**: Mantine provides a comprehensive design token system, first-class dark/light color scheme management, accessible form inputs (`NumberInput`, `Select`, `SegmentedControl`), and flexible layout primitives (`Stack`, `Group`, `Card`, `Text`, `Title`).
- **Configuration**:
  - Base font size set to 18px (`md: '1.125rem'`).
  - Font family set to native system sans-serif stack.
  - Border radius set to `sm` for crisp, Swiss-style geometric cards and buttons.
  - Dark mode set to obsidian/zinc hues for a refined Mobbin-like aesthetic.
- **Alternatives considered**: Tailwind CSS (requires custom accessible components and form widgets), raw CSS (high maintenance).

### 3. Routing: Wouter
- **Choice**: `wouter` for SPA routing.
- **Rationale**: Extremely lightweight (~1.5KB), minimal API surface (`<Route path="/predict">`, `<Link>`, `useLocation`), fully supports browser History API and direct URL deep-linking without the bulk of React Router.
- **Alternatives considered**: TanStack Router (overkill for 2 static pages), React Router v7 (heavyweight bundle).

### 4. State & Local Storage: Jotai with `atomWithStorage`
- **Choice**: `jotai` using `atomWithStorage`.
- **Rationale**: Minimalist atom-based state management that synchronizes unit system preference (`'us'` vs `'metric'`) and user-modified baseline dry FG directly to `localStorage`. Page-specific form inputs (like current batch size or target ABV) remain in standard React local state or query params.
- **Alternatives considered**: React Context + manual `localStorage` hooks (boilerplate-heavy), Zustand (good but Jotai atoms compose cleaner for simple persisted preferences).

### 5. Iconography: Lucide React
- **Choice**: `lucide-react`.
- **Rationale**: Consistent stroke weight, geometric clarity, and pairs cleanly with Swiss typographic layouts.

## Risks / Trade-offs

- **[Precision / Rounding Errors in Gravity]** $\rightarrow$ Specific gravity calculations use floating point numbers which can produce values like `1.0500000000002`.
  - *Mitigation*: Format all gravity displays with `.toFixed(3)` and sanitize intermediate calculations.
- **[Displacement Confusion]** $\rightarrow$ Users adding 10 lbs of sugar to a 5-gallon batch will produce more than 5 gallons of liquid, slightly reducing final gravity.
  - *Mitigation*: Prominently display a disclaimer footnote stating calculations assume the batch size represents final volume.
- **[Units Mismatch on Switch]** $\rightarrow$ Switching from US (gallons) to Metric (liters) could display confusing numbers if not converted cleanly.
  - *Mitigation*: Convert current input values when the unit toggle is clicked (e.g. 5 gal $\rightarrow$ 18.9 L) or maintain canonical values in state.
