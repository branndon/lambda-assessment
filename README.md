# Lambda.ai — Homepage Clone

A pixel-faithful recreation of the [Lambda.ai](https://lambda.ai) homepage, built as a front-end engineering assessment. The implementation covers the **Hero**, **Features**, and **Hardware** sections with all animations, interactions, and responsive behaviour preserved.

---

## Table of Contents

- [Live Preview](#live-preview)
- [Tech Stack](#tech-stack)
- [Accessibility](#accessibility)
- [Features](#features)
- [Project Structure](#project-structure)
- [Architecture Decisions](#architecture-decisions)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Scripts](#scripts)

---

## Live Preview

```bash
npm run dev   # → http://localhost:3000
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | Extracted production CSS from Lambda.ai + Tailwind CSS |
| Animation | HTML5 Canvas 2D API, CSS transitions |
| Testing | Jest 30 + React Testing Library + Testing Library Jest DOM |
| Linting | ESLint (next/core-web-vitals) |

---

## Accessibility

| Area | Implementation |
|---|---|
| Keyboard focus | `:focus-visible` ring (`2px solid rgba(255,255,255,0.65)`) — shown only for keyboard navigation, hidden for mouse/touch via `:focus { outline: none }` |
| Landmark regions | All three `<section>` elements carry `aria-label` so screen readers can navigate between Hero / Features / Hardware |
| Duplicate heading | The reduced-motion `<h1>` is `aria-hidden="true"` — the animated `<h1>` already exposes its text via `<span className="sr-only">`, preventing double-announcement |
| Accordion ARIA | Each accordion button has `aria-expanded`, `aria-controls`, and a unique `id`; each panel has `role="region"` + `aria-labelledby` pointing back to its button |
| Animated heading | Character spans inside the heading are `aria-hidden="true"`; the screen-reader text lives in a single `sr-only` span |
| Decorative SVG | `AiInfrastructureDiagram` carries `aria-hidden="true"` — it is purely illustrative |
| Canvas animation | `HeroBackground` container is `aria-hidden="true"`; the animation loop is skipped entirely when `prefers-reduced-motion: reduce` is set |
| Hardware keyboard nav | All GPU cards are keyboard-focusable (`tabIndex` default) — no card is unreachable by Tab |
| `inert` panels | Collapsed accordion panels use the HTML `inert` attribute so their content is invisible to AT and cannot receive focus |

---

## Features

### Hero Section
- **Canvas particle animation** — 220 light rays and 7 mist clouds rendered via the HTML5 Canvas 2D API
- **Perspective convergence** — a parabolic curve (`perspY`) bends each ray toward a focal point at 44 % of the viewport height, creating an optical "warp" effect without any radial trigonometry
- **3-pass bloom rendering** — each ray is drawn three times (wide glow → mid glow → sharp core) to simulate HDR bloom without `ctx.filter: blur()`, keeping performance high
- **Font-swap animation** — 1 random character in the heading flashes to a highlighted variant on a recurring interval, matching the original site behaviour
- **Flash-free resize** — uses `window.addEventListener('resize')` instead of `ResizeObserver` on the section element; isolates the canvas from DOM content changes so the font-swap animation never causes a background flicker

### Features Section
- **Animated isometric SVG stack** — four infrastructure layers rendered in isometric projection (painter's algorithm, bottom-to-top)
- **Per-layer symbols** — each active layer shows a unique decorative marker:
  - Layer 0 — uniform dot grid
  - Layer 1 — concentric dotted isometric squares
  - Layer 2 — concentric elliptical radar rings
  - Layer 3 — large ring with filled inner lens, orbital glow dots, and outer dotted rings
- **Chromatic aberration** — active layer edges have cyan/magenta offset outlines (RGB split effect)
- **Smooth gap-open transition** — layers below the active one slide down via `translateY` CSS transform with `cubic-bezier(0.4, 0, 0.2, 1)` easing (540 ms)
- **Opacity fade for markers** — symbols and RGB borders are always mounted (no React unmount/remount flash) and transition via `opacity`
- **Accordion** — items expand/collapse with smooth `max-height` animation; item 1 is locked open

### Hardware Section
- **Horizontal accordion** — four GPU product cards expand on click with image, title, and description
- **Smart title wrapping** — for inactive "NVIDIA HGX" cards, the model suffix (`HGX B300` / `HGX B200`) is wrapped in a `no-wrap` span so the break only occurs before "HGX", preventing orphaned model numbers

---

## Project Structure

```
lambda-assessment/
├── app/
│   ├── layout.tsx               # Root layout — metadata, global CSS imports
│   ├── page.tsx                 # Entry page — composes the three sections
│   ├── globals.css              # Base reset
│   └── globals-lambda.css       # Production CSS extracted from lambda.ai
│
├── components/
│   ├── Hero/
│   │   ├── index.tsx            # HeroSection layout (heading, CTAs)
│   │   ├── HeroBackground.tsx   # Canvas element + animation loop
│   │   ├── useFontSwap.ts       # Hook — random character highlight effect
│   │   ├── particleEngine.ts    # buildRay, paintRay, buildMist, paintMist
│   │   ├── types.ts             # LightRay, MistCloud interfaces
│   │   └── constants.ts         # RAY_COUNT, FOCAL_Y, SPECTRUM, heading copy
│   │
│   ├── Features/
│   │   ├── index.tsx            # FeaturesSection — accordion + diagram
│   │   └── data.ts              # ITEMS array with types
│   │
│   ├── Hardware/
│   │   ├── index.tsx            # HardwareSection — horizontal GPU accordion
│   │   └── data.ts              # PRODUCTS array with types
│   │
│   └── InfrastructureDiagram/
│       ├── index.tsx            # AiInfrastructureDiagram (main export)
│       ├── SlabBlock.tsx        # Single isometric slab (3 faces + label)
│       ├── RgbFrame.tsx         # Chromatic-aberration border
│       ├── utils.ts             # project(), polygon(), shared constants
│       └── markers/
│           ├── DotPattern.tsx   # Layer 0 symbol
│           ├── SquareMarker.tsx # Layer 1 symbol
│           ├── RadialRings.tsx  # Layer 2 symbol
│           ├── EllipseMarker.tsx# Layer 3 symbol
│           └── index.ts         # SLAB_MARKERS[] export
│
├── __tests__/                   # Unit tests (mirrors components/)
│   ├── Hero/
│   ├── Features/
│   ├── Hardware/
│   └── InfrastructureDiagram/
│
├── types/
│   ├── global.d.ts              # Augments React with `inert` HTML attribute
│   └── css.d.ts                 # Ambient wildcard for plain CSS side-effect imports
│
├── jest.config.ts
├── jest.setup.ts
└── tsconfig.json
```

---

## Architecture Decisions

### 1. Canvas animation decoupled from React layout

The canvas animation (`HeroBackground`) reads `window.innerWidth / innerHeight` directly and listens only to `window.resize`. An earlier version used `ResizeObserver` on the `<section>` element, which caused the font-swap animation to trigger a full particle reinit (and visible flash) every time heading font metrics changed briefly. Switching to viewport-level events completely isolates the animation from DOM content changes.

### 2. 3-pass bloom without `ctx.filter`

Calling `ctx.filter = 'blur(Xpx)'` forces a full compositing layer per draw call and is extremely expensive at 220 rays × 60 fps. Instead, each ray is stroked three times with increasing `lineWidth` and decreasing `globalAlpha`:

```
Pass 1  width × 14   alpha × 0.06   → wide soft outer glow
Pass 2  width × 5    alpha × 0.18   → mid glow
Pass 3  width × 1    alpha × 1.00   → sharp core
```

This achieves a convincing bloom effect at a fraction of the GPU cost.

### 3. Parabolic perspective convergence

All rays move horizontally (left → right or right → left). A parabolic `perspY` function offsets each ray's Y position based on its distance from `FOCAL_Y = 0.44`:

```ts
const t    = (x / W - 0.5) * 2;         // −1 … +1 across width
const dist = Math.abs(yFrac - FOCAL_Y) / FOCAL_Y;
const k    = 0.04 + dist * 0.07;
const sign = yFrac <= FOCAL_Y ? -1 : 1;
return yBase + sign * k * t * t * H;
```

Rays far from the focal point curve more aggressively. The result looks like a radial burst without any `sin/cos` radial math.

### 4. SVG markers always mounted — opacity transition

React's mount/unmount cycle for per-layer SVG symbols created a jarring pop when switching accordion items. The fix is to always keep all markers in the DOM and transition their `opacity` (0 → 1) instead:

```tsx
<g style={{ opacity: lit ? 1 : 0, transition: `opacity 540ms ease` }}>
  <Marker idx={idx} lit={lit} />
</g>
```

### 5. Tier labels animated via CSS `transform`, not `y` attribute

The right-column audience labels ("AI DEVELOPERS", etc.) needed to shift down when lower layers opened the gap. Changing the SVG `y` attribute directly causes an instant jump because SVG attributes are not CSS-animatable. The fix is to keep `y` as a fixed base value and animate `style.transform: translateY(Xpx)`:

```tsx
style={{
  transform:  `translateY(${shift}px)`,
  transition: `transform 540ms cubic-bezier(0.4, 0, 0.2, 1)`,
}}
```

### 6. Component folder structure

Each section lives in its own folder with a clear separation of concerns:

| File type | Convention |
|---|---|
| `index.tsx` | Public component export (the React component) |
| `data.ts` | Static data arrays + TypeScript interfaces |
| `utils.ts` | Pure functions and constants (no JSX) |
| `types.ts` | Shared TypeScript interfaces |
| Hooks (`use*.ts`) | Isolated side-effect logic, custom hooks |

### 7. Ambient CSS type declaration

Next.js only ships types for `*.module.css`. Plain CSS files imported as side effects (e.g. `import "./globals.css"`) trigger `ts(2882)`. The fix is a **separate ambient file** (`types/css.d.ts`) with no top-level imports, so TypeScript treats it as a global ambient declaration:

```ts
// types/css.d.ts — no imports, so this is ambient (not a module)
declare module '*.css';
```

Placing this declaration inside `types/global.d.ts` (which contains `import 'react'`) would make it a module-scoped declaration instead of a global wildcard — it would not work.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd lambda-assessment

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Testing

The test suite uses **Jest 30** + **React Testing Library** and covers all components and utility modules.

```bash
# Run all tests (single pass)
npm test

# Run with coverage report
npm run test:coverage
```

### Test results

```
Test Suites: 9 passed, 9 total
Tests:       78 passed, 78 total
Time:        ~1.9 s
```

### Coverage highlights

| Module | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| `InfrastructureDiagram/` | 100 % | 100 % | 100 % | 100 % |
| `InfrastructureDiagram/markers/` | 100 % | 100 % | 100 % | 100 % |
| `Hero/particleEngine.ts` | 100 % | 100 % | 100 % | 100 % |
| `Hero/useFontSwap.ts` | 100 % | 100 % | 100 % | 100 % |
| `Hero/constants.ts` | 100 % | 100 % | 100 % | 100 % |
| `Hero/index.tsx` | 100 % | 89 % | 100 % | 100 % |
| `Hardware/index.tsx` | 100 % | 100 % | 100 % | 100 % |
| `Features/index.tsx` | 100 % | 95 % | 100 % | 100 % |
| **All files** | **91 %** | **97 %** | **91 %** | **91 %** |

### Test strategy

| Test file | What is covered |
|---|---|
| `Hero/HeroSection.test.tsx` | Renders, heading text, CTA links, canvas element presence |
| `Hero/particleEngine.test.ts` | `buildRay` / `buildMist` shape + ranges; `paintRay` 3-pass bloom, off-screen skip, canvas state preservation; `paintMist` radial draw + off-screen skip |
| `Hero/useFontSwap.test.ts` | Initial state, exactly-1-char highlight, SWAP_POOL membership, flash restore, recurring interval, unmount cleanup — using `jest.useFakeTimers()` |
| `Features/FeaturesSection.test.tsx` | Renders all items, default open state, click to expand, body text, locked item stays open, `aria-controls` / `aria-labelledby` linking |
| `Features/data.test.ts` | Item count, required fields, unique IDs, locked flag |
| `Hardware/HardwareSection.test.tsx` | Renders all cards, default active state, click to change active, description visibility, image `onError` handler |
| `Hardware/data.test.ts` | Product count, required fields, unique IDs, image URLs |
| `InfrastructureDiagram/AiInfrastructureDiagram.test.tsx` | SVG presence, slab labels, tier labels, `activeIndex` range |
| `InfrastructureDiagram/utils.test.ts` | `project()` mapping, `polygon()` formatting, constants shape |

> **Canvas mock** — `HTMLCanvasElement.prototype.getContext` is mocked to return `null`. `HeroBackground` exits its `useEffect` early when the context is unavailable, so the component still renders its DOM tree correctly without the animation loop running.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run all unit tests (single pass) |
| `npm run test:coverage` | Run tests with Istanbul coverage report |
