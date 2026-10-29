# MOTION LIBRARY — Master Plan & Build Spec for Claude Code

> **Purpose of this file:** This is the single source of truth for building a world-class animation + UX/UI design library for **web (React / Next.js)** and **mobile (React Native / Expo)**. Hand this file to Claude Code and execute it phase by phase.
>
> **Working name:** `kinetik` (rename freely — search/replace `kinetik` everywhere).
> **Research date:** October 2026. Versions below were current at research time — **always run `npm view <pkg> version` before installing and use the latest stable.**

---

## 0. Instructions for the coding agent (read first)

1. **Work in phases** (Section 10). Finish, test, and commit each phase before starting the next. Never skip Phase 0 and Phase 1.
2. **Every component follows the Component Contract** (Section 6). No exceptions.
3. **Pick the animation engine using the Engine Decision Tree** (Section 3). Do not reach for a heavy library when CSS can do it.
4. **Reduced motion is mandatory.** Every animation must have a `prefers-reduced-motion` fallback (web) or `useReducedMotion` / `ReduceMotion` fallback (native).
5. **Write original code.** Use 21st.dev, Magic UI, Aceternity, React Bits, Motion Primitives, Fancy Components, Codrops, Refero and Mobbin as *inspiration only*. Never copy code from paid/Pro libraries (Aceternity Pro, React Bits Pro, 21st paid templates). MIT-licensed sources may be studied; credit them in `CREDITS.md` if a pattern is closely derived.
6. **Install official agent skills** before writing GSAP code:
   ```bash
   npx skills add https://github.com/greensock/gsap-skills
   ```
7. After every component: run `pnpm typecheck && pnpm lint && pnpm test` and view it in the docs app. Fix before moving on.
8. Keep a running `PROGRESS.md` at the repo root: checklist of every component ID from Section 7/8 with status (`todo / wip / done / blocked`).
9. If something in this spec is ambiguous, choose the option that is (a) more accessible, (b) lighter in bundle size, (c) closer to the native platform feel — and note the decision in `DECISIONS.md`.

---

## 1. Vision

Build a **copy-paste-first, registry-distributed** motion library — the same model as shadcn/ui and 21st.dev — where:

- Every component is **source code that lands in the user's repo** (not a black-box npm dependency), installable through the **shadcn CLI** from our own registry.
- Every component ships with a **live preview, code, props table, install command and an "AI prompt"** (21st.dev style: one copy → any coding agent rebuilds it in the user's project).
- Web and mobile share **one motion language**: the same durations, easings, spring presets, and naming.
- It's organized like **Refero / Mobbin**: browse by *category*, *UI element*, *page type*, and *flow* (onboarding, checkout, paywall, auth…).

### What we're learning from each inspiration source

| Source | What to borrow |
|---|---|
| **21st.dev** | Community *registry* model (shadcn registry format, code copied into repo), live previews, "Copy prompt" for AI agents (Claude Code / Cursor / v0 / Lovable), author pages, bookmarks/collections, an MCP server so agents can pull components from inside the editor. |
| **Magic UI** | Largest animated shadcn registry (~150–250 items). Polished marketing pieces: Animated Beam, Globe, Marquee, Bento Grid, Number Ticker, Shimmer Button, Blur Fade, Border Beam. |
| **Aceternity UI** | Bold, cinematic effects: 3D cards, spotlight, aurora/beam backgrounds, hero sections. Dark, dramatic aesthetic. |
| **React Bits** | Fastest-growing animated library; customization-first, ships reduced-motion controls, doesn't force Framer Motion as a dependency, offers multiple CSS variants (Tailwind / plain CSS). |
| **Motion Primitives** | Low-level composable motion building blocks rather than finished sections. |
| **Fancy Components** | Playful micro-interactions, text effects, physics. |
| **Cult UI / Eldora / Animata / Kibo / Origin UI** | Breadth; Kibo/Origin for *product* (non-marketing) components. |
| **Refero** | Web-first reference library with strong filtering by page type, UX pattern, UI element and industry; ~6,000 user flows; AI search. → Use its taxonomy for our docs navigation. |
| **Mobbin** | Deepest mobile + web flow library (onboarding, checkout, subscriptions, settings), 600k+ screens, MCP for agents on paid plans. → Use its *flows* as targets for our mobile blocks. |
| **Codrops / Awwwards / GSAP showcase** | High-end scroll storytelling, WebGL image effects, text reveals. |

**Lesson from the market:** animated registries are "marketing-shaped" and thin on product UI (tables, forms, settings, empty states). **Our differentiator:** cover *both* marketing motion **and** product-UI motion **and** mobile, with a unified token system and accessibility built in.

---

## 2. Research summary — the animation ecosystem (Oct 2026)

### 2.1 Web — JavaScript animation engines

| Library | Status / version (verify) | Best for | Notes |
|---|---|---|---|
| **GSAP** (`gsap`) | v3.15.x. **100% free incl. all former Club plugins** (Webflow acquisition) | Timelines, scroll storytelling, text splitting, SVG morph/draw, motion paths, Flip, draggable/inertia | Plugins: ScrollTrigger, ScrollSmoother, SplitText, ScrambleText, Flip, Draggable, Inertia, Observer, MorphSVG, DrawSVG, MotionPath, Physics2D, CustomEase/Wiggle/Bounce, GSDevTools. Use `@gsap/react` → `useGSAP()` for cleanup. Use `gsap.matchMedia()` for responsive + reduced motion. |
| **Motion** (`motion`, formerly Framer Motion) | v13.x (v13 released Aug 2026; multidimensional `Reorder`, RTL). Import from `motion/react` | React state animations, gestures (hover/tap/drag), `AnimatePresence` exit animations, layout/shared-layout animations, springs | Full `motion` component ~34 KB gz; `LazyMotion` + `m` ~4.6 KB. Remove Tailwind `transition-*` classes on motion elements (they conflict). |
| **Lenis** (`lenis`) | v1.3.x (darkroom.engineering) | Smooth scrolling with native scrollbar | Sync with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`. `data-lenis-prevent` for scrollable modals. Locomotive Scroll v5 is now built on Lenis. |
| **Anime.js** (`animejs`) | v4.x (4.5 as of mid-2026), MIT, ES-module, tree-shakeable | Lightweight vanilla animations, staggers, timers, draggables, scroll sync | v4 API: `animate(target, {…})`, `createTimeline`, easing names without `ease` prefix. Good for non-React demos / tiny bundles. |
| **Three.js** (`three`) | r18x; **WebGPU production-ready** in all major browsers (~95% coverage) with automatic WebGL2 fallback | 3D, particles, shaders, image distortion | Use **TSL** (Three Shading Language) — compiles to WGSL and GLSL. `three/webgpu` + `three/tsl` imports. |
| **React Three Fiber** (`@react-three/fiber`) | v9.x (React 19) + `@react-three/drei` v10.x | 3D in React | WebGPU via async `gl` factory prop on `<Canvas>`. Add `@react-three/postprocessing`, `maath`, `leva` (dev only). |
| **Rive** (`@rive-app/react-canvas` / `react-webgl2`) | Active | Interactive, stateful vector animation (state machines, data binding) | Smaller files than Lottie; best for buttons, mascots, onboarding characters. |
| **Lottie** (`@lottiefiles/dotlottie-react`) | Active, industry standard | Designer → dev handoff from After Effects | Use `.lottie` format. Decorative, non-interactive motion. |
| **AutoAnimate** (`@formkit/auto-animate`) | Active | Zero-config list add/remove/reorder | Great default for product lists. |
| **tsParticles / canvas-confetti** | Active | Particles, confetti | Lazy-load. |
| **Theatre.js** | Niche | Visual timeline editing for 3D/cinematic | Optional, Phase 6+. |

### 2.2 Web — native platform features (no library)

| Feature | Support (2026) | Use for |
|---|---|---|
| **View Transitions API** — same-document (`document.startViewTransition`) and cross-document (`@view-transition { navigation: auto; }`) | Chrome, Safari 18+, Firefox (same-doc). Cross-document: verify Firefox at build time | Route/page transitions, shared-element morphs, theme toggles. Next.js has experimental `viewTransition` support + React `<ViewTransition>` — check current docs. |
| **CSS Scroll-Driven Animations** (`animation-timeline: scroll() / view()`) | Chrome 115+, Safari 26, Firefox shipping/rolling — reached Baseline status in 2026. Always guard with `@supports (animation-timeline: scroll())` | Reveal-on-scroll, progress bars, parallax — **runs off main thread**, better LCP/CLS than JS scroll libraries |
| **`@starting-style` + `transition-behavior: allow-discrete`** | Baseline | Enter animations from `display:none` (popovers, dialogs) without JS |
| **`@property`** | Baseline | Animating gradients, angles, custom props (conic border beams) |
| **`linear()` easing** | Baseline | Spring/bounce easings in pure CSS |
| **Popover API + anchor positioning** | Chrome/Safari; verify Firefox | Tooltips, menus |
| **Individual transforms** (`translate`, `scale`, `rotate`) | Baseline | Composable transforms |

**Rule of thumb from 2026 practice:** ~80% of common marketing-site animations can now be pure CSS (scroll reveals, progress, hover states); keep GSAP for complex sequences, pinning, and text splitting.

### 2.3 Mobile — React Native / Expo

| Library | Status | Best for |
|---|---|---|
| **Reanimated 4** (`react-native-reanimated` 4.3.x + `react-native-worklets`) | Stable; **New Architecture only**. Babel plugin is now `react-native-worklets/plugin` | **CSS-compatible animations & transitions API** for state-driven animations + worklets/shared values for gesture-driven, scroll-driven, keyboard-driven motion; layout animations (`entering`/`exiting`/`layout`) |
| **Gesture Handler** (`react-native-gesture-handler` 2.31+) | Stable | Pan, pinch, swipe, long-press, composed gestures |
| **React Native Skia** (`@shopify/react-native-skia` 2.6+) | Stable, Expo SDK 55+ | GPU canvas, SkSL shaders, blur, path morphing (`usePathInterpolation`), charts, Skottie (Lottie in Skia) |
| **Moti** | Stable | Framer-Motion-like declarative API on top of Reanimated (`from` / `animate`, `AnimatePresence`, skeletons) |
| **react-native-ease** (App&Flow) | New 2026 | Declarative animations driven by Core Animation (iOS) / ObjectAnimator (Android) — lowest UI-thread cost for simple transitions. Evaluate in Phase 7. |
| **Rive RN** (`rive-react-native`) / **lottie-react-native** | Stable | Interactive / designer animations |
| **expo-haptics** | Stable | Haptic feedback on every meaningful interaction |
| **@gorhom/bottom-sheet**, **expo-router** (native stack, shared transitions) | Stable | Sheets, navigation transitions |
| Baseline | Expo SDK 55+ / React Native 0.83–0.85, Hermes, New Architecture; RN 0.85 introduces a Shared Animation Backend — check status | |

---

## 3. Engine Decision Tree (agent must follow)

```
Is it a simple hover/focus/active state, fade, or enter from display:none?
  → CSS transitions + @starting-style. STOP.

Is it a scroll reveal / scroll progress / simple parallax?
  → CSS scroll-driven animation with @supports guard,
    fallback = IntersectionObserver + Motion `whileInView`. STOP.

Is it a page/route transition or shared element between routes?
  → View Transitions API (Next.js + React <ViewTransition> if available),
    fallback = Motion AnimatePresence + layoutId. STOP.

Is it React state-driven (open/closed, selected, list reorder, layout change, drag, gesture)?
  → Motion (motion/react). Use layout / layoutId / AnimatePresence / Reorder.

Is it a multi-step choreographed sequence, pinned scroll story, horizontal scroll,
text splitting, SVG draw/morph, motion path, or scrubbed timeline?
  → GSAP (+ ScrollTrigger / SplitText / Flip / DrawSVG / MorphSVG) via useGSAP().

Does the whole page need smooth/inertial scrolling?
  → Lenis provider (synced to GSAP ticker if GSAP is present).

Is it 3D, particles >1k, shaders, image distortion, liquid/displacement?
  → React Three Fiber + drei (+ WebGPU/TSL where useful). Lazy-load + <Suspense>.

Is it an illustration/character/icon designed by a designer?
  → Interactive/stateful → Rive. Linear playback from After Effects → Lottie (.lottie).

MOBILE:
  State-driven → Reanimated 4 CSS animations/transitions (or Moti).
  Gesture/scroll/keyboard-driven → Reanimated worklets + Gesture Handler.
  Custom graphics/shaders/charts/blur → Skia.
  Designer assets → Rive / Lottie.
  Always pair meaningful interactions with expo-haptics.
```

---

## 4. Tech stack & repo architecture

### 4.1 Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Language:** TypeScript (strict)
- **Web:** Next.js (App Router, latest stable), React 19, Tailwind CSS v4, shadcn/ui primitives (Radix), `motion`, `gsap` + `@gsap/react`, `lenis`, `@react-three/fiber` + `drei`, `three`
- **Docs content:** MDX (Fumadocs or Next.js MDX) + `shiki` for code highlighting
- **Mobile:** Expo (latest SDK), Expo Router, Reanimated 4, Gesture Handler, Skia, Moti, expo-haptics, NativeWind (optional)
- **Testing:** Vitest + Testing Library (logic/a11y), Playwright (visual regression + reduced-motion snapshots), axe-core
- **Distribution:** shadcn registry (`registry.json` → `shadcn build` → `public/r/*.json`) + optional MCP server

### 4.2 Folder structure

```
kinetik/
├─ apps/
│  ├─ docs/                    # Next.js gallery + docs site (21st.dev/Refero-like)
│  │  ├─ app/
│  │  │  ├─ (marketing)/       # landing page — built ONLY with our own components
│  │  │  ├─ components/[category]/[slug]/page.tsx
│  │  │  ├─ blocks/[category]/[slug]/page.tsx
│  │  │  ├─ flows/[flow]/page.tsx        # Mobbin-style flows (onboarding, checkout…)
│  │  │  └─ playground/                  # token tuner: easing/spring visualizer
│  │  ├─ public/r/             # built registry JSON (generated)
│  │  └─ registry.json
│  └─ mobile/                  # Expo Router gallery app for native components
├─ packages/
│  ├─ tokens/                  # motion tokens → TS + CSS vars + Tailwind theme + RN
│  ├─ core/                    # shared hooks: useReducedMotion, useInViewOnce, springs
│  ├─ web/                     # React components (source for registry)
│  │  └─ src/<category>/<slug>/
│  │     ├─ <slug>.tsx         # the component
│  │     ├─ <slug>.demo.tsx    # docs demo(s)
│  │     ├─ <slug>.meta.ts     # metadata (see contract)
│  │     ├─ <slug>.prompt.md   # AI "copy prompt"
│  │     └─ <slug>.test.tsx
│  ├─ native/                  # React Native components (same structure)
│  └─ mcp/                     # (Phase 9) MCP server exposing the registry to agents
├─ PROGRESS.md
├─ DECISIONS.md
├─ CREDITS.md
└─ turbo.json
```

---

## 5. Motion design tokens (the shared language)

Create in `packages/tokens`. Export as: TS object, CSS custom properties, Tailwind v4 `@theme` values, and RN-ready values.

### 5.1 Durations

| Token | ms | Use |
|---|---|---|
| `instant` | 0 | reduced-motion swaps |
| `micro` | 100 | press, toggle thumb, checkbox |
| `fast` | 150 | hover, tooltip, focus ring |
| `base` | 220 | dropdown, popover, small enter/exit |
| `moderate` | 320 | modal, drawer, tab content |
| `slow` | 480 | page section reveals, large layout shifts |
| `slower` | 700 | hero intros, text reveals |
| `cinematic` | 1200 | storytelling sequences only |

### 5.2 Easings

| Token | Value | Use |
|---|---|---|
| `standard` | `cubic-bezier(0.2, 0, 0, 1)` | most UI |
| `enter` (decelerate) | `cubic-bezier(0, 0, 0.2, 1)` | elements appearing |
| `exit` (accelerate) | `cubic-bezier(0.4, 0, 1, 1)` | elements leaving |
| `emphasized` | `cubic-bezier(0.2, 0, 0, 1.0)` + longer duration | hero, important changes |
| `expoOut` | `cubic-bezier(0.16, 1, 0.3, 1)` | text reveals, premium feel |
| `backOut` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | playful pops |
| `springCss` | generated `linear(...)` string | spring feel in pure CSS |
| `linear` | `linear` | scroll-scrubbed, marquees, spinners |

Also map to GSAP names (`power3.out`, `expo.out`, `back.out(1.7)`) and Anime.js v4 names (`outExpo`…).

### 5.3 Springs (Motion + Reanimated — keep numbers identical)

| Preset | stiffness | damping | mass | Feel |
|---|---|---|---|---|
| `snappy` | 500 | 35 | 1 | toggles, tabs indicator |
| `smooth` | 260 | 30 | 1 | default layout animations |
| `gentle` | 120 | 20 | 1 | cards, sheets |
| `bouncy` | 400 | 15 | 1 | likes, success, playful |
| `heavy` | 200 | 40 | 1.5 | drawers, large panels |

Also export Motion's `visualDuration`/`bounce` equivalents.

### 5.4 Distances, stagger & other

- Translate distances: `xs 4px`, `sm 8px`, `md 16px`, `lg 32px`, `xl 64px`.
- Stagger: `tight 0.02s` (chars), `base 0.05s` (words/list), `loose 0.1s` (cards).
- Blur for blur-in: `8px → 0`.
- Scale for press: `0.97`; hover lift: `-2px` + shadow step.

### 5.5 Reduced motion policy

- **Web:** global CSS `@media (prefers-reduced-motion: reduce)` sets `--kinetik-motion-scale: 0`. Every component reads `useReducedMotion()` (from `packages/core`, wrapping Motion's) and **replaces movement with opacity-only or instant state change**. GSAP: wrap in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. Lenis: disable smooth scroll. Autoplaying marquees/backgrounds: pause.
- **Native:** Reanimated `ReduceMotion.System` + `useReducedMotion()`; same opacity-only fallback.
- Docs site has a global **"Reduce motion" toggle** to preview fallbacks.

---

## 6. Component Contract (every component must satisfy)

### 6.1 `<slug>.meta.ts`

```ts
export const meta = {
  id: "text-split-reveal",
  name: "Split Text Reveal",
  category: "text",                 // from Section 7 categories
  platforms: ["web"],               // "web" | "native"
  engine: "gsap",                   // css | motion | gsap | lenis | r3f | rive | lottie | reanimated | skia | moti
  dependencies: ["gsap", "@gsap/react"],
  registryDependencies: ["kinetik-tokens", "use-reduced-motion"],
  tags: ["hero", "headline", "scroll", "premium"],
  pageTypes: ["landing", "portfolio"],   // Refero-style
  inspiration: ["Codrops text reveals", "GSAP SplitText demos"],
  a11y: "Text remains in DOM as a single accessible string (aria-label on wrapper, split spans aria-hidden). Reduced motion: fade only.",
  perf: "Transforms + opacity only. Reverts split on unmount/resize.",
  status: "stable",                 // experimental | beta | stable
};
```

### 6.2 Code rules

- `"use client"` only where needed. Server-render the static markup.
- Props: always include `className`, `as` (polymorphic where it makes sense), `disabled`/`paused`, timing overrides (`duration`, `delay`, `ease`/`spring`), and `once` for in-view triggers.
- **Animate only `transform`, `opacity`, `filter`, `clip-path`** unless unavoidable. No layout-thrashing properties in loops.
- Clean up everything (GSAP `useGSAP` scope / `context.revert()`, observers, RAF loops, WebGL disposal).
- Pause off-screen loops (IntersectionObserver) and when `document.hidden`.
- Lazy-load heavy engines (`next/dynamic`, `React.lazy`) — three/R3F, Rive, Lottie, particles never in the main bundle.
- Keyboard + screen-reader parity: anything triggered by hover must also trigger on focus; drag interactions need a button/keyboard alternative.
- Theme via CSS variables (shadcn tokens) — works in light and dark.
- No hard-coded colors; no layout shift (reserve space).

### 6.3 Docs page per component (auto-generated from meta + demo)

1. Live preview (with **Replay**, **Reduce motion** toggle, light/dark, viewport: desktop/tablet/mobile)
2. Variants gallery
3. Code tabs: component / demo / usage
4. **Install:** `npx shadcn@latest add https://<domain>/r/<slug>.json`
5. **Copy AI prompt** button (contents of `<slug>.prompt.md`: what it is, dependencies, full source, how to adapt to user's theme)
6. Props table (generated from TS types)
7. Accessibility + performance notes, engine badge, bundle-size badge
8. "Used in" — blocks/flows that use it; "Similar" components

### 6.4 Definition of Done

- [ ] Meets contract + passes typecheck, lint, unit tests, axe
- [ ] Playwright visual snapshot (normal + reduced motion, light + dark)
- [ ] 60fps on mid-range device profile (Chrome DevTools 4× CPU throttle) — no long tasks > 50ms during animation
- [ ] Registry item builds and installs into a clean Next.js app
- [ ] Listed in `PROGRESS.md` as done

---

## 7. WEB CATALOG (categories → components)

Legend — Engine: `CSS` · `M` = Motion · `G` = GSAP · `L` = Lenis · `3D` = R3F/three · `R` = Rive · `Lt` = Lottie · `A` = Anime.js. Priority: **P1** (MVP) · **P2** · **P3**.

### 7.1 Foundations & providers
| ID | Component | Engine | Priority | Notes |
|---|---|---|---|---|
| `motion-provider` | Root provider: tokens, reduced motion, LazyMotion | M | P1 | |
| `smooth-scroll` | Lenis provider + GSAP ticker sync, anchor-link support, `data-lenis-prevent` | L+G | P1 | disable on reduced motion & touch by option |
| `in-view` | `<InView>` / `useInViewOnce` primitive | CSS/M | P1 | |
| `animate-presence-route` | Route exit/enter wrapper (fallback for View Transitions) | M | P1 | |
| `view-transition-link` | Link that triggers View Transitions + named elements helper | CSS | P1 | |
| `easing-playground` | Docs tool: visualize easings/springs, copy values | M | P2 | docs only |

### 7.2 Text animations
| ID | Component | Engine | Pri |
|---|---|---|---|
| `text-split-reveal` | Lines/words/chars slide up from mask on view | G (SplitText) | P1 |
| `text-blur-in` | Words fade + unblur with stagger | M | P1 |
| `text-scramble` | Decode/scramble effect (hover or on view) | G (ScrambleText) | P1 |
| `text-typewriter` | Typing + caret, multiple strings | M | P1 |
| `text-rotate` | Rotating word in a sentence ("Build ___") with layout-aware width | M | P1 |
| `number-ticker` | Counts to value on view, locale formatting | M | P1 |
| `text-gradient-animated` | Moving gradient fill (`@property`) | CSS | P1 |
| `text-shimmer` | Shimmer sweep across text | CSS | P1 |
| `text-scroll-highlight` | Words light up as you scroll (scrubbed) | CSS SDA / G | P2 |
| `text-highlighter` | Marker underline/highlight draws on view | CSS/SVG | P2 |
| `text-variable-weight` | Variable font weight responds to cursor proximity | M | P2 |
| `text-velocity-marquee` | Huge marquee text that speeds/skews with scroll velocity | G | P2 |
| `text-on-path` | Text animating along SVG path | G (MotionPath) | P3 |
| `text-3d-flip` | Letters flip in 3D on hover | CSS | P3 |
| `text-glitch` | RGB split glitch | CSS | P3 |

### 7.3 Scroll & storytelling
| ID | Component | Engine | Pri |
|---|---|---|---|
| `scroll-reveal` | Generic reveal (fade/slide/scale/blur) — CSS SDA first, Motion fallback | CSS/M | P1 |
| `scroll-progress` | Reading progress bar / circle | CSS SDA | P1 |
| `parallax-layer` | Parallax with speed prop | CSS SDA / G | P1 |
| `sticky-stack-cards` | Cards stack & scale as you scroll | G / CSS sticky | P1 |
| `horizontal-scroll-section` | Vertical scroll → horizontal track (pinned) | G (ScrollTrigger pin) | P1 |
| `pinned-story` | Pinned section with step-by-step content swap (Apple/Stripe style) | G | P2 |
| `image-sequence-scrub` | Canvas frame sequence scrubbed by scroll (Apple product pages) | G + canvas | P2 |
| `zoom-through-hero` | Hero image/mask zooms through as you scroll | G | P2 |
| `scroll-velocity-skew` | Elements skew with scroll speed | G / L | P2 |
| `scroll-collapse-header` | Large header morphs into compact sticky nav (scroll-linked View Transition) | CSS SDA + VT | P2 |
| `scroll-video-scrub` | Video currentTime scrubbed by scroll | G | P3 |
| `scroll-snap-sections` | Full-page snap with progress dots | CSS | P3 |

### 7.4 Page & route transitions
| ID | Component | Engine | Pri |
|---|---|---|---|
| `vt-crossfade` | Default cross-document fade | CSS VT | P1 |
| `vt-shared-element` | Card → detail page morph (`view-transition-name`) | CSS VT | P1 |
| `transition-curtain` | Color curtain wipe between pages | G / M | P2 |
| `transition-slide-stack` | iOS-like push/pop for web | VT / M | P2 |
| `transition-circle-reveal` | Circular clip-path reveal from click point (theme toggle too) | VT | P2 |
| `preloader-intro` | Brand intro/counter preloader (skippable, shown once) | G | P3 |

### 7.5 Layout & FLIP
| ID | Component | Engine | Pri |
|---|---|---|---|
| `animated-tabs` | Sliding pill/underline indicator (`layoutId`) | M | P1 |
| `accordion-smooth` | Height auto animation | M / CSS `interpolate-size` | P1 |
| `expandable-card` | Card expands to modal/detail (shared layout) | M | P1 |
| `reorder-list` | Drag-to-reorder (multi-dimensional grid in Motion v13) | M | P1 |
| `auto-animate-list` | Add/remove/sort animations | AutoAnimate / M | P1 |
| `filter-grid-flip` | Filtered grid with FLIP shuffle | G (Flip) | P2 |
| `layout-grid-toggle` | Grid ↔ list view morph | M | P2 |
| `dynamic-island` | Morphing pill that expands into states | M | P2 |
| `morphing-popover` | Button morphs into popover/form | M | P2 |

### 7.6 Buttons & micro-interactions
| ID | Component | Engine | Pri |
|---|---|---|---|
| `button-press` | Base: scale on press, hover lift, focus ring | CSS | P1 |
| `button-shimmer` | Shimmer sweep CTA | CSS | P1 |
| `button-magnetic` | Pulls toward cursor | M | P1 |
| `button-border-beam` | Light beam traveling around border (`@property` conic) | CSS | P1 |
| `button-stateful` | idle → loading → success/error morph | M | P1 |
| `button-hold-confirm` | Hold-to-confirm with progress fill (keyboard: hold Enter) | M | P2 |
| `button-ripple` | Material ripple | CSS/M | P2 |
| `button-liquid` | Gooey/liquid hover (SVG filter) | CSS | P3 |
| `like-burst` | Heart with particle burst | M | P1 |
| `copy-button` | Copy → check morph | M | P1 |
| `toggle-switch` | Spring thumb, optional icon morph | M | P1 |
| `checkbox-draw` | Checkmark draws in | CSS/SVG | P1 |
| `theme-toggle` | Sun/moon morph + VT circle reveal | M + VT | P1 |
| `animated-icon-set` | Hover-animated icons (menu↔close, arrow, bell, search, settings) | M/SVG | P2 |
| `rating-stars` | Stars fill with bounce | M | P2 |
| `confetti-trigger` | Confetti on success (lazy) | canvas-confetti | P2 |

### 7.7 Cursor & pointer effects
| ID | Component | Engine | Pri |
|---|---|---|---|
| `custom-cursor` | Dot + ring follower with states (hover link, view, drag) | M / G quickTo | P2 |
| `spotlight` | Radial spotlight following pointer over section | CSS vars | P1 |
| `tilt-card` | 3D tilt + glare | M | P1 |
| `cursor-trail` | Image/particle trail | G | P3 |
| `follow-eyes` | Elements look at cursor | M | P3 |
| *All pointer effects disabled on touch devices and reduced motion.* | | | |

### 7.8 Backgrounds & ambient
| ID | Component | Engine | Pri |
|---|---|---|---|
| `bg-aurora` | Soft aurora gradients | CSS | P1 |
| `bg-grid-dots` | Grid/dot pattern with radial vignette mask | CSS | P1 |
| `bg-gradient-mesh` | Animated mesh gradient | CSS/@property | P1 |
| `bg-noise` | Film grain overlay | CSS/SVG | P1 |
| `bg-beams` | Light beams / collision beams | M / SVG | P2 |
| `bg-meteors` | Falling meteors | CSS | P2 |
| `bg-particles` | Interactive particles (canvas, pauses off-screen) | canvas | P2 |
| `bg-shader-gradient` | WebGL/WebGPU flowing shader gradient (TSL) | 3D | P2 |
| `bg-ripple-grid` | Grid cells ripple on click | M | P3 |
| `bg-starfield` | Warp starfield | 3D/canvas | P3 |

### 7.9 Cards & surfaces
| ID | Component | Engine | Pri |
|---|---|---|---|
| `card-spotlight-border` | Border lights up near cursor | CSS | P1 |
| `bento-grid` | Bento layout with per-tile micro-animations | CSS/M | P1 |
| `card-glass` | Glassmorphism with subtle parallax | CSS | P2 |
| `card-flip` | 3D flip front/back (click + keyboard) | CSS | P2 |
| `card-stack-swipe` | Tinder-style swipe deck (buttons as alternative) | M drag | P2 |
| `card-hover-reveal` | Image/content reveal on hover | CSS | P2 |
| `animated-beam` | Animated connector beams between nodes (integrations diagram) | M/SVG | P2 |

### 7.10 Navigation
| ID | Component | Engine | Pri |
|---|---|---|---|
| `navbar-hide-on-scroll` | Hides on scroll down, shows on up; blur/shrink on scroll | M | P1 |
| `menu-toggle-morph` | Hamburger ↔ close morph + full-screen menu with stagger | M / G | P1 |
| `dock-magnify` | macOS-style dock magnification | M | P2 |
| `mega-menu` | Animated dropdown with shared indicator (Stripe/Vercel style) | M | P2 |
| `command-palette` | ⌘K palette with spring open + list animations | M | P2 |
| `breadcrumb-animated` | Animated crumb add/remove | M | P3 |
| `sidebar-collapse` | Collapsible sidebar with label fade | M | P2 |

### 7.11 Overlays
| ID | Component | Engine | Pri |
|---|---|---|---|
| `dialog-animated` | Scale + fade + backdrop blur, `@starting-style` fallback | CSS/M | P1 |
| `drawer-draggable` | Drag-to-dismiss drawer with velocity snap (Vaul-like) | M | P1 |
| `toast-stack` | Stacked toasts, expand on hover, swipe dismiss (Sonner-like) | M | P1 |
| `tooltip-animated` | Spring tooltip, origin-aware | M / CSS popover | P1 |
| `popover-morph` | Trigger morphs into panel | M | P2 |
| `context-menu-animated` | Right-click menu with stagger | M | P3 |

### 7.12 Loaders, progress & feedback
| ID | Component | Engine | Pri |
|---|---|---|---|
| `skeleton-shimmer` | Skeleton blocks + shimmer | CSS | P1 |
| `spinner-set` | 8 spinner variants (dots, orbital, bars, ring, wave, pulse, morph, bouncing) | CSS | P1 |
| `progress-bar-animated` | Determinate + indeterminate | CSS | P1 |
| `progress-ring` | Circular progress with count | SVG/M | P1 |
| `success-check` | Animated success/error states | SVG/M | P1 |
| `empty-state-animated` | Illustrated empty state (Lottie/Rive slot) | Lt/R | P2 |
| `page-loader-bar` | Top-of-page route progress (NProgress style) | CSS | P2 |

### 7.13 Data visualization motion
| ID | Component | Engine | Pri |
|---|---|---|---|
| `stat-counter-grid` | KPI cards with ticker + delta badge | M | P1 |
| `chart-bar-grow` | Bars grow on view | M | P2 |
| `chart-line-draw` | Line/sparkline draws on view | SVG/M | P2 |
| `chart-donut` | Animated donut segments | SVG/M | P2 |
| `globe-interactive` | Rotating globe with arcs/markers | 3D (or cobe-style canvas) | P2 |
| `live-ticker` | Real-time number changes with digit roll | M | P3 |

### 7.14 SVG & illustration
| ID | Component | Engine | Pri |
|---|---|---|---|
| `svg-path-draw` | Draw strokes on view/scroll | G (DrawSVG) / CSS | P1 |
| `svg-morph` | Shape morphing | G (MorphSVG) | P2 |
| `svg-motion-path` | Object follows a path (scroll-scrubbed option) | G (MotionPath) | P2 |
| `rive-player` | Wrapper: lazy-load, state-machine inputs as props, reduced motion | R | P1 |
| `lottie-player` | Wrapper for `.lottie`, play on view, reduced motion = static frame | Lt | P1 |

### 7.15 3D & WebGL
| ID | Component | Engine | Pri |
|---|---|---|---|
| `canvas-3d-shell` | R3F `<Canvas>` wrapper: lazy, DPR clamp, WebGPU w/ WebGL fallback, pause off-screen | 3D | P1 |
| `hero-3d-model` | GLTF model hero with scroll-linked rotation | 3D + G | P2 |
| `image-distortion-hover` | Image ripple/displacement on hover (shader) | 3D | P2 |
| `particles-morph` | Particles morph between shapes/text | 3D (TSL compute) | P3 |
| `liquid-blob` | Noise-driven blob | 3D | P3 |
| `infinite-gallery-3d` | Curved/infinite WebGL gallery with drag inertia | 3D | P3 |

### 7.16 Media, carousels & galleries
| ID | Component | Engine | Pri |
|---|---|---|---|
| `marquee` | Infinite logo/testimonial marquee, pause on hover, reverse, vertical | CSS | P1 |
| `carousel-drag` | Drag carousel with inertia + snap + buttons | M / G Draggable | P1 |
| `image-reveal-mask` | Clip-path image reveal on view | CSS/G | P1 |
| `lightbox-shared` | Thumbnail → fullscreen shared element | M / VT | P2 |
| `video-hover-preview` | Video plays on hover/focus | CSS/JS | P2 |
| `before-after-slider` | Compare slider (keyboard accessible) | M | P2 |
| `cover-flow` | 3D cover flow | CSS 3D | P3 |

### 7.17 Forms & inputs
| ID | Component | Engine | Pri |
|---|---|---|---|
| `input-floating-label` | Floating label + animated focus underline | CSS | P1 |
| `otp-input` | OTP with caret blink + shake on error | M | P1 |
| `form-stepper` | Multi-step form with directional slide + progress | M | P1 |
| `password-strength` | Animated strength meter | M | P2 |
| `search-expand` | Icon expands into search field | M | P2 |
| `file-dropzone` | Drag-over states + upload progress | M | P2 |
| `error-shake` | Shake + color on invalid (reduced motion: color only) | CSS | P1 |

### 7.18 Blocks (full sections built from components)
Organize by Refero page types: **Landing, Pricing, Auth, Dashboard, Portfolio, Blog, E-commerce, Docs, 404**.

| ID | Block | Built from |
|---|---|---|
| `hero-split-text` | Headline split reveal + CTA shimmer + aurora bg | text-split-reveal, button-shimmer, bg-aurora |
| `hero-3d` | 3D model hero + scroll rotation | hero-3d-model, smooth-scroll |
| `hero-video-zoom` | Video zoom-through hero | zoom-through-hero |
| `features-bento` | Animated bento features | bento-grid, animated-beam |
| `features-sticky-story` | Pinned scrolling feature steps | pinned-story |
| `logo-cloud-marquee` | Logos marquee with edge fade | marquee |
| `testimonials-wall` | Two-row opposite marquees | marquee |
| `pricing-toggle` | Monthly/yearly toggle with number ticker | toggle-switch, number-ticker |
| `stats-section` | Counters on view | stat-counter-grid |
| `faq-accordion` | Smooth accordion | accordion-smooth |
| `cta-spotlight` | CTA with spotlight + beams | spotlight, bg-beams |
| `footer-reveal` | Footer revealed under content (sticky) | CSS |
| `auth-card` | Login with OTP, error shake, success | otp-input, button-stateful |
| `dashboard-shell` | Collapsible sidebar, command palette, KPIs | sidebar-collapse, command-palette, stat-counter-grid |
| `portfolio-gallery` | Horizontal scroll gallery + custom cursor | horizontal-scroll-section, custom-cursor |
| `404-playful` | Animated 404 | rive/lottie + text-scramble |
| `checkout-steps` | Stepper checkout with success confetti | form-stepper, confetti-trigger |

---

## 8. MOBILE CATALOG (React Native / Expo)

Engine: `RC` = Reanimated CSS API · `RW` = Reanimated worklets · `GH` = Gesture Handler · `SK` = Skia · `MT` = Moti · `R/Lt` = Rive/Lottie. **Every interactive item triggers appropriate `expo-haptics`.**

### 8.1 Foundations
| ID | Component | Engine | Pri |
|---|---|---|---|
| `native-motion-provider` | Tokens, reduced motion, haptics settings | — | P1 |
| `pressable-scale` | Spring press scale + haptic (base for all buttons) | RW/RC | P1 |
| `animated-presence-native` | Enter/exit wrapper using layout animations | RW | P1 |

### 8.2 Micro-interactions
| ID | Component | Engine | Pri |
|---|---|---|---|
| `native-toggle` | iOS-feel switch with spring | RC | P1 |
| `native-like-burst` | Heart + particles (Skia) | SK + RW | P1 |
| `native-button-stateful` | idle → loading → success | RC | P1 |
| `native-checkbox` | Animated check draw | SK/SVG | P1 |
| `native-otp` | OTP cells, shake on error | RW | P1 |
| `native-segmented` | Segmented control with sliding indicator | RW | P1 |
| `native-counter` | Rolling digits | RW | P2 |

### 8.3 Gestures
| ID | Component | Engine | Pri |
|---|---|---|---|
| `swipe-row-actions` | Swipe list row to reveal actions (delete/archive) | GH + RW | P1 |
| `swipe-card-deck` | Tinder-style deck with rotation + velocity | GH + RW | P1 |
| `bottom-sheet` | Snap points, backdrop, keyboard-aware (wrap @gorhom) | GH + RW | P1 |
| `pinch-zoom-image` | Pinch/pan/double-tap zoom | GH + RW | P2 |
| `drag-reorder-list` | Long-press drag to reorder | GH + RW | P2 |
| `pull-to-refresh-custom` | Custom animated refresh (Lottie/Skia) | RW + SK | P2 |
| `draggable-fab` | Floating button that snaps to edges | GH + RW | P3 |

### 8.4 Scroll & lists
| ID | Component | Engine | Pri |
|---|---|---|---|
| `collapsing-header` | Large title → compact header | RW (useAnimatedScrollHandler) | P1 |
| `parallax-header-image` | Stretchy/parallax hero image | RW | P1 |
| `list-entering` | Staggered list item entering/exiting/layout | RW layout anims | P1 |
| `sticky-section-headers` | Animated sticky headers | RW | P2 |
| `scroll-progress-native` | Reading progress | RW | P3 |

### 8.5 Navigation & transitions
| ID | Component | Engine | Pri |
|---|---|---|---|
| `animated-tab-bar` | Custom tab bar with sliding indicator + icon bounce | RW | P1 |
| `shared-element-transition` | List → detail shared element (Expo Router / Reanimated) | RW | P2 |
| `dynamic-island-native` | Expanding pill notification | RW | P2 |
| `modal-scale-background` | iOS card modal that scales background | RW | P2 |
| `drawer-menu` | Side drawer with content push/scale | GH + RW | P2 |

### 8.6 Loading & feedback
| ID | Component | Engine | Pri |
|---|---|---|---|
| `native-skeleton` | Skeleton + shimmer | MT / SK | P1 |
| `native-spinner-set` | Spinners | RC / SK | P1 |
| `native-toast` | Stacked toasts, swipe dismiss | GH + RW | P1 |
| `native-progress-ring` | Circular progress | SK | P2 |
| `native-success` | Success/error animation | R/Lt | P2 |

### 8.7 Graphics (Skia)
| ID | Component | Engine | Pri |
|---|---|---|---|
| `skia-shader-bg` | Animated SkSL gradient/aurora background | SK | P2 |
| `skia-blur-glass` | Backdrop blur glass card | SK | P2 |
| `skia-line-chart` | Interactive line chart with scrubbing + haptics (stocks-app feel) | SK + GH | P2 |
| `skia-path-morph` | Icon/shape morph | SK | P3 |
| `skia-particles` | Particle effects | SK | P3 |

### 8.8 Mobile flows (Mobbin-style blocks)
| ID | Flow | Contents |
|---|---|---|
| `flow-onboarding` | 3–4 page onboarding with parallax pager, dot indicator morph, Rive character | P1 |
| `flow-paywall` | Animated plan selector, feature list stagger, CTA shimmer, trial toggle | P1 |
| `flow-auth` | Sign in / OTP / success | P1 |
| `flow-checkout` | Cart → address → payment → success with confetti | P2 |
| `flow-profile-settings` | Collapsing header profile + animated settings toggles | P2 |
| `flow-empty-error-states` | Animated empty, offline, error screens | P2 |
| `flow-habit-check-in` | Daily check-in with streak flame + progress ring (reusable for habit apps) | P2 |

---

## 9. Docs site (the "gallery") — features

Model after 21st.dev (discovery + install) and Refero/Mobbin (taxonomy).

- **Home:** hero built entirely with kinetik components (dogfooding), category grid, "trending", "new".
- **Navigation:** sidebar by Category (Section 7/8), plus filters: Engine, Platform (web/native), Page type, Tag, Bundle size, Status.
- **Search:** ⌘K command palette (fuzzy search over meta: name, tags, category, pageTypes).
- **Component page:** per Section 6.3.
- **Blocks page:** full-width previews with responsive viewport switcher.
- **Flows page:** Mobbin-style step-by-step screens (mobile flows rendered as phone frames; link to Expo gallery via QR code).
- **Playground:** easing/spring visualizer, duration tuner, copy as CSS / Motion / GSAP / Reanimated.
- **Collections/bookmarks:** localStorage per user (P3).
- **Global toggles:** theme, reduced motion, replay all.
- **SEO:** each component page has proper metadata + OG image (generated).
- **Performance:** previews render in isolated iframes or lazy client islands so one heavy demo never slows the page.

---

## 10. Build phases (execute in order)

### Phase 0 — Setup (day 1)
- [ ] Init pnpm + Turborepo monorepo per Section 4.2
- [ ] Next.js docs app (Tailwind v4, shadcn/ui init, dark mode, MDX)
- [ ] Expo app with Expo Router, Reanimated 4 (+ worklets babel plugin), Gesture Handler, Skia, Moti, haptics
- [ ] ESLint, Prettier, Vitest, Playwright, axe, Husky + lint-staged
- [ ] Install GSAP agent skills; create `PROGRESS.md`, `DECISIONS.md`, `CREDITS.md`
- [ ] CI (GitHub Actions): typecheck, lint, test, build registry

### Phase 1 — Tokens & core
- [ ] `packages/tokens` (Section 5) → TS, CSS vars, Tailwind `@theme`, RN export
- [ ] `packages/core`: `useReducedMotion`, `useInViewOnce`, `usePrefersTouch`, `useIsVisible` (document hidden), spring presets, GSAP setup helper (register plugins once, matchMedia reduced-motion)
- [ ] `motion-provider`, `smooth-scroll`, `native-motion-provider`
- [ ] Playground page (easing/spring visualizer)

### Phase 2 — Registry + docs engine
- [ ] Component page generator from `meta.ts` + demos
- [ ] `registry.json` + `shadcn build` script; verify `npx shadcn add` into a fresh Next app
- [ ] "Copy AI prompt" generator (template + source inlined)
- [ ] Preview frame with Replay / Reduce motion / viewport / theme
- [ ] Props table generation (react-docgen-typescript or ts-morph)

### Phase 3 — Web P1 components
- [ ] All **P1** items in 7.1–7.17 (≈60 components). Order: buttons & micro → text → scroll → layout → overlays → loaders → nav → backgrounds → cards → media → forms → svg/lottie/rive → 3D shell

### Phase 4 — Web blocks + landing page
- [ ] Blocks in 7.18; docs home page built from them

### Phase 5 — Web P2
- [ ] All **P2** web items

### Phase 6 — Mobile foundations + P1
- [ ] All **P1** in Section 8 inside the Expo gallery app; flows `onboarding`, `paywall`, `auth`

### Phase 7 — Mobile P2 + Skia
- [ ] Remaining P2 mobile + Skia set; evaluate `react-native-ease` for simple transitions and record decision

### Phase 8 — P3 + polish
- [ ] P3 items, 3D experiments, cursor effects, OG images, bookmarks

### Phase 9 — Distribution & AI tooling
- [ ] Publish registry on Vercel (domain)
- [ ] `packages/mcp`: MCP server with tools `search_components(query, filters)`, `get_component(id)` (returns source + install + prompt), `list_categories()` — so Claude Code/Cursor can pull components like 21st.dev's Magic MCP
- [ ] A Claude Code skill (`SKILL.md`) that teaches agents the engine decision tree + tokens + install commands
- [ ] README, contribution guide, changelog, license (MIT)

---

## 11. Performance budgets

| Metric | Budget |
|---|---|
| Docs page JS (excluding heavy demo islands) | < 150 KB gz |
| Single P1 component added to an app | CSS-only: 0 KB JS · Motion: use `m` + LazyMotion where possible · GSAP core ~25 KB gz shared |
| 3D/Rive/Lottie/particles | Always lazy, never in initial bundle |
| Frame budget | 16.6ms (60fps), aim 8.3ms (120Hz) — no layout reads in animation loops |
| CLS from animations | 0 (reserve space, animate transforms) |
| Mobile | All continuous animations on UI thread (worklets/CSS API/Skia), never JS-thread `Animated` without native driver |

---

## 12. Accessibility checklist (per component)

- [ ] Reduced-motion fallback verified (web + native)
- [ ] No content hidden only behind animation (text readable without JS)
- [ ] Hover effects have focus equivalents; drag has keyboard/button alternative
- [ ] Auto-playing motion > 5s can be paused (marquees, backgrounds, carousels) — WCAG 2.2.2
- [ ] No flashing > 3 times/second — WCAG 2.3.1
- [ ] Split text keeps accessible name (`aria-label` + `aria-hidden` on fragments)
- [ ] Focus is managed in overlays (dialog/drawer/command palette) — use Radix primitives
- [ ] Native: `accessibilityRole`, `accessibilityState`, labels; haptics respect system settings

---

## 13. Testing strategy

- **Unit (Vitest):** props, state transitions, reduced-motion branch renders.
- **A11y (axe + Testing Library):** every demo.
- **Visual (Playwright):** each demo screenshotted at end-state with animations fast-forwarded (`page.emulateMedia({ reducedMotion: 'reduce' })` + a "complete animations" test hook), light/dark, mobile/desktop viewports.
- **Install test (CI):** script creates a temp Next.js app and runs `shadcn add` for every registry item, then `next build`.
- **Mobile:** Jest + `@testing-library/react-native` for logic; manual device QA checklist (iPhone + mid-range Android) per phase.

---

## 14. Naming & code conventions

- IDs: kebab-case, `<category-prefix>-<name>` for ambiguous ones (`bg-aurora`, `text-scramble`).
- Components: PascalCase (`TextScramble`, `BgAurora`).
- Native components prefixed folder `native/`, same names where equivalent (`AnimatedTabs` on both platforms with matching props where possible).
- Every component exports its props type `TextScrambleProps`.
- Tokens are imported, never inlined: `duration.base`, `ease.expoOut`, `spring.smooth`.

---

## 15. Kick-off prompt (paste into Claude Code)

```
Read motion-library-master-plan.md fully. You are the lead engineer.
Execute Phase 0 and Phase 1 now. Follow Section 0 rules strictly:
- verify latest stable versions with `npm view` before installing,
- create PROGRESS.md listing every component ID from Sections 7 and 8,
- follow the Engine Decision Tree and Component Contract,
- commit after each completed checklist item with a conventional commit message.
When Phase 1 is complete, run all checks, show me the docs app running,
summarize what was built, list decisions made in DECISIONS.md, and wait
for my "continue" before starting Phase 2.
```

For later phases: `Continue with Phase N. Same rules. Stop and report at the end of the phase.`

---

## 16. Reference links (for the agent to consult)

- GSAP docs: https://gsap.com/docs/v3/ · React guide (`useGSAP`) · Agent skills: https://github.com/greensock/gsap-skills
- Motion: https://motion.dev
- Lenis: https://github.com/darkroomengineering/lenis
- Anime.js v4: https://animejs.com
- Three.js: https://threejs.org · R3F: https://r3f.docs.pmnd.rs · Drei
- View Transitions: https://developer.chrome.com/docs/web-platform/view-transitions/
- Scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
- shadcn registry docs: https://ui.shadcn.com/docs/registry
- Reanimated 4: https://docs.swmansion.com/react-native-reanimated/ · Gesture Handler · RN Skia: https://shopify.github.io/react-native-skia/
- Rive: https://rive.app/docs · dotLottie: https://lottiefiles.com
- Inspiration: https://21st.dev · https://magicui.design · https://ui.aceternity.com · https://reactbits.dev · https://motion-primitives.com · https://fancycomponents.dev · https://refero.design · https://mobbin.com · https://tympanus.net/codrops · https://www.awwwards.com
