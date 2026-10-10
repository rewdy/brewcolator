# AGENTS.md

Guidance for agents working in this repository.

## Project overview

**brewcolator** is a client-side homebrew fermentation calculator built with React 19, TypeScript ~6.0, Vite 8, and Mantine v7. It is hosted at `https://brewcolator.rewdy.lol`.

It focuses on wine, mead, cider, and high-sugar homebrew ferments, providing two main modes:
1. **Outcome Forecaster (`/predict`)**: Computes predicted final gravity (FG), expected ABV %, and fermentation character (Dry vs. Sweet / Incomplete) based on batch size, starting original gravity (OG), yeast alcohol tolerance (% ABV), and a customizable baseline dry FG (default 0.998). Displays warnings if yeast alcohol limits cause early stalls.
2. **Chaptalization & ABV Targeter (`/boost`)**: Computes required target original gravity and addition weight of a selectable fermentable (Table Sugar, Corn Sugar, Honey, Maple Syrup, Brown Sugar, DME, or custom PPG) to achieve a target ABV from current starting gravity and batch size. Displays feasibility warnings if target ABV exceeds yeast tolerance.

- **Design System**: Swiss typography-inspired, Mobbin-style high-contrast layout using `@mantine/core` v7 with an 18px base typography scale (`md: '1.125rem'`), tabular numbers, and full light/dark color scheme toggle.
- **Icon Pack**: `lucide-react`.
- **Routing**: Client-side routing via `wouter` (`/predict`, `/boost`, redirect from `/`).
- **State & Persistence**: `jotai` with `atomWithStorage` for user preferences (US $\leftrightarrow$ Metric unit toggle and default baseline dry FG) stored in `localStorage`.
- **Package Manager**: **Bun** (`bun.lock` is committed). Always use `bun`/`bunx`, not npm/yarn/pnpm.
- **Unit Testing**: `bun test` runs native Bun tests (`src/lib/brewing-math.test.ts`).

## Commands

Run from the repo root:

```bash
bun install          # install dependencies (use bun, not npm)
bun run dev          # Vite dev server with HMR (default port 5173)
bun test             # run unit test suite using Bun test runner
bun run build        # tsc -b && vite build -> type-check then bundle to dist/
bun run lint         # oxlint
bun run preview      # serve the production build from dist/
```

`build` runs `tsc -b` first, so TypeScript errors fail the build. Use `bun run build` as the compiler check; there is no standalone `typecheck` script.

## Structure and architecture

```
index.html                     # single HTML entry; mounts <div id="root"> and /src/main.tsx
src/main.tsx                   # ColorSchemeScript, MantineProvider, imports styles
src/App.tsx                    # Root app layout: Header, Wouter Switch/Routes, Footer
src/theme.ts                   # Mantine theme configuration (18px base md, system sans font stack, xs radius)
src/index.css                  # Mantine styles import (@mantine/core/styles.css) and root layout rules
src/components/
  Header.tsx                   # Centered brand title with wine icon, route tabs, unit toggle, dark mode toggle
src/views/
  PredictView.tsx              # /predict view: Batch parameters & outcome prediction cards
  BoostView.tsx                # /boost view: Chaptalization inputs & sugar addition results
src/lib/
  brewing-math.ts              # Pure brewing calculation functions, unit conversions, and fermentable database
  brewing-math.test.ts         # Unit tests covering fermentation forecasting and chaptalization formulas
src/state/
  atoms.ts                     # Jotai atoms with localStorage persistence (unitSystemAtom, defaultDryFgAtom)
openspec/
  specs/                       # Durable specifications (brewing-calculator capability)
  changes/archive/             # Archived OpenSpec changes
  config.yaml                  # OpenSpec configuration
```

## Calculation & domain logic

All brewing math is isolated in `src/lib/brewing-math.ts`:
- **Potential ABV**: $(\text{OG} - \text{Dry FG}) \times 131.25$
- **Stalled FG**: $\text{OG} - \left(\frac{\text{Tolerance}}{131.25}\right)$
- **Target OG**: $\text{Dry FG} + \left(\frac{\text{Target ABV}}{131.25}\right)$
- **Points Deficit**: $(\text{Target OG} - \text{Current OG}) \times 1000 \times \text{Volume in Gal}$
- **Sugar Weight (lbs)**: $\frac{\text{Total Points}}{\text{PPG}}$
- **Units**: US (Gallons, lbs, oz) and Metric (Liters, kg, g). 1 Gallon = 3.78541 Liters; 1 lb = 453.59237 g.
- **Displacement Disclaimer**: UI explicitly notes that entered batch size is treated as final liquid volume without modeling sugar displacement.

## Code conventions

- **TypeScript strictness**: `tsconfig.app.json` has `verbatimModuleSyntax: true` and `erasableSyntaxOnly: true`.
  - Always use `import type { ... }` for type-only imports; plain import of types is a compile error.
  - No enums, namespaces, or constructor parameter properties (non-erasable syntax). Use `as const` objects and union types instead.
  - `noUnusedLocals` and `noUnusedParameters` are enabled.
  - Types in `tsconfig.app.json` include `"@types/bun"` to support `bun:test` declarations.
- **CSS & Theming**: Styling is driven by `@mantine/core` theme and component props (`variant="default"`, `radius="xs"`, `fw={800}`, etc.). Avoid writing custom CSS files; leverage Mantine's CSS variables and layout components (`Stack`, `Group`, `Grid`, `Card`, `Box`).
- **Equal-height columns pattern**: On grid layouts, use `<Grid align="stretch">` and apply `style={{ height: '100%' }}` on child cards/stacks so left and right columns visually align.
- **Linting**: Oxlint is configured in `.oxlintrc.json`. Run `bun run lint` before committing.

## OpenSpec (spec-driven workflow)

This project uses [OpenSpec](https://openspec.dev) for change planning:
- Durable capabilities live in `openspec/specs/` (e.g. `openspec/specs/brewing-calculator/spec.md`).
- To propose new features or modifications: `/opsx:propose <name>`, review artifacts, apply with `/opsx:apply`, and archive with `/opsx:archive`.
- Never manually create directories in `openspec/changes/`; use `openspec new change "<name>"`.
