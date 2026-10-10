# Proposal

## Why

Homebrewers producing cider, mead, and wine need quick, reliable calculations to forecast fermentation outcomes and adjust alcohol by volume (ABV) through chaptalization (adding sugars/honey). Existing brewing tools are often overly complex, tailored strictly to beer mashing, or buried behind cluttered interfaces. Brewcolator provides a focused, single-page web calculator with bookmarkable modes to predict final gravity and determine sugar additions needed to achieve a target ABV.

## What Changes

- Add a responsive single-page web app with client-side routing between two core modes:
  - **Outcome Predictor (`/predict`)**: Computes predicted final gravity (FG), expected ABV %, and fermentation profile (dry vs. stalled/sweet) from batch size, starting original gravity (OG), yeast alcohol tolerance, and an optional baseline dry FG.
  - **Chaptalization Booster (`/boost`)**: Computes required target OG and addition weight of a chosen fermentable (table sugar, corn sugar, honey, maple syrup, brown sugar, DME, or custom PPG) to achieve a target ABV from current OG, batch size, and yeast tolerance.
- Add dynamic US (Gallons, lbs/oz) and Metric (Liters, kg/g) unit toggling with state persisted to localStorage.
- Add proactive yeast tolerance feasibility checks and warnings when a target or potential ABV exceeds yeast alcohol limits.
- Add disclaimer footnotes communicating the simplified batch volume assumption (ignoring volume displacement from added sugars).
- Establish a Swiss typography-inspired, high-contrast monochrome design system (18px base font, tabular numerals, light and dark color schemes) powered by Mantine UI and Lucide icons.

## Capabilities

### New Capabilities
- `brewing-calculator`: Core calculation engine and interactive interfaces for fermentation outcome forecasting (`/predict`) and chaptalization sugar boosting (`/boost`), including unit toggling and feasibility warnings.

### Modified Capabilities
*(None - fresh project without existing specs)*

## Impact

- **UI & Routing**: Adds `@mantine/core`, `@mantine/hooks`, `@tabler/icons-react` (if peer-required) / `lucide-react`, and `wouter` for routing.
- **State Management**: Adds `jotai` with `atomWithStorage` for persisting user preferences (unit system, default dry FG baseline, color scheme).
- **Codebase**: Replaces boilerplate landing page in `src/App.tsx` and sets up modular calculation utilities, route views, and a Mantine theme provider.
