# Tasks

## 1. Dependencies and Theme Setup

- [x] 1.1 Install `@mantine/core`, `@mantine/hooks`, `wouter`, `jotai`, and `lucide-react` using `bun add`, and verify `package.json` updates cleanly
- [x] 1.2 Configure Mantine theme in `src/theme.ts` with 18px base typography, system sans font stack, and light/dark palette, verifying with a build check (`bun run build`)
- [x] 1.3 Setup Mantine provider, ColorSchemeScript/toggle, and core layout container in `src/main.tsx` and `src/App.tsx`, and verify basic page rendering

## 2. Calculation Engine and State Atoms

- [x] 2.1 Implement pure brewing formulas in `src/lib/brewing-math.ts` (potential ABV, predicted FG with yeast tolerance stall, required target OG, points deficit, and fermentable addition weights in US and Metric units)
- [x] 2.2 Add unit tests for `src/lib/brewing-math.ts` covering dry completion, stalled fermentation, target OG calculation, and fermentable weights, and verify with `bun test`
- [x] 2.3 Create shared state atoms in `src/state/atoms.ts` using Jotai `atomWithStorage` for unit preference (`'us' | 'metric'`) and customizable dry FG baseline

## 3. Navigation and Route Shell

- [x] 3.1 Build navigation header component (`src/components/Header.tsx`) with route links (`/predict` and `/boost`), unit toggle (US/Metric), and color scheme toggle, verifying UI switches
- [x] 3.2 Configure Wouter routing in `src/App.tsx` with redirect from `/` to `/predict` and distinct routes for `/predict` and `/boost`, verifying deep linking

## 4. Outcome Forecasting Mode (`/predict`)

- [x] 4.1 Implement `PredictView` component (`src/views/PredictView.tsx`) with input controls for Batch Size, Initial OG, Yeast Tolerance, and collapsible baseline Dry FG
- [x] 4.2 Add high-contrast typographic hero metric displays for Predicted FG and Expected ABV %, with dry vs. stalled badges and warning banners when yeast tolerance is exceeded, and verify calculations update live

## 5. Chaptalization and ABV Targeting Mode (`/boost`)

- [x] 5.1 Implement `BoostView` component (`src/views/BoostView.tsx`) with inputs for Batch Size, Current OG, Target ABV, Yeast Tolerance, and fermentable dropdown (Table Sugar, Corn Sugar, Honey, Maple Syrup, Brown Sugar, DME, Custom)
- [x] 5.2 Add output cards displaying Required Target OG, points deficit, and addition weight (formatted in lbs/oz or kg/g based on active unit), plus yeast tolerance feasibility warnings and displacement disclaimer footnote
- [x] 5.3 Verify all outputs update reactively upon changing inputs, fermentable choice, or unit system toggle

## 6. Verification and Polish

- [x] 6.1 Run full typecheck and lint suite (`bun run lint && bun run build`) and fix any compiler or lint warnings
- [x] 6.2 Verify responsive layout behavior in both light and dark themes
