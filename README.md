# Brewcolator

> Minimalist Homebrew Fermentation Engine for Cider, Mead & Wine.

Live site: [https://brewcolator.rewdy.lol](https://brewcolator.rewdy.lol)

Brewcolator is a single-page web calculator built for homebrewers crafting wine, mead, cider, and other high-sugar ferments. It provides clean, instant forecasting and chaptalization targeting wrapped in a Swiss typography-inspired, high-contrast interface.

---

## Features

### 1. Outcome Forecaster (`/predict`)
- **Final Gravity & ABV Prediction**: Enter your batch size, starting gravity (OG), and yeast alcohol tolerance to forecast exact final gravity and expected ABV.
- **Yeast Stall & Sweetness Warnings**: Proactively alerts you if your starting sugar levels will exceed your yeast's alcohol tolerance ceiling, estimating stalled final gravity and residual sweetness.
- **Customizable Baseline**: Defaults to dry fermentation (0.998 FG), with advanced settings to customize baseline target dry gravity.

### 2. Chaptalization & ABV Targeter (`/boost`)
- **Sugar & Honey Addition Calculations**: Enter your current starting gravity, desired target ABV, batch size, and yeast tolerance to calculate the exact weight of fermentables needed.
- **Fermentable Library with Standard PPG**:
  - Table Sugar / Sucrose (46 PPG)
  - Corn Sugar / Dextrose (42 PPG)
  - Honey (35 PPG)
  - Maple Syrup (30 PPG)
  - Brown Sugar (45 PPG)
  - Dry Malt Extract / DME (44 PPG)
  - Custom PPG input
- **Feasibility Warnings**: Flags when target ABV exceeds yeast alcohol limits, warning that extra additions will cause high residual sweetness rather than alcohol.
- **Ballpark Displacement Note**: Footnote reminders that calculations assume batch size represents final fermenter volume.

### 3. Polish & Usability
- **Dynamic Unit Toggling**: Seamlessly switch between US Customary (Gallons, lbs, oz) and Metric (Liters, kg, g).
- **Persistent Preferences**: Saves unit preferences and baseline settings to browser local storage.
- **Swiss Typography Design**: Editorial, high-contrast aesthetic with an 18px base typographic scale, tabular figures for gravity values, and full light/dark color scheme support.
- **Bookmarkable Routing**: Clean client-side routing via Wouter (`/predict` and `/boost`).

---

## Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **UI Components & Theming**: [@mantine/core v7](https://mantine.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [Wouter](https://github.com/molefrog/wouter)
- **State & Storage**: [Jotai](https://jotai.org/) (`atomWithStorage`)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## Development

Install dependencies using Bun:

```bash
bun install
```

Start the local development server:

```bash
bun run dev
```

Run unit tests:

```bash
bun test
```

Type-check and build for production:

```bash
bun run build
```

Run linter:

```bash
bun run lint
```

Preview production build:

```bash
bun run preview
```

---

## License

MIT © [rewdy](https://rewdy.lol)
