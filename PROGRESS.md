# PROGRESS

Status of every component ID in `motion-library-master-plan.md` (Sections 7 & 8).

**Summary:** 78 plan items done · 14 partial/covered · 106 todo (mostly P2/P3 web items and native Expo source) · 87 registry items live (71 components, 10 blocks, 6 flows).

Legend: ✅ done · 🟡 partial / covered by another item · ⬜ todo

> Generated from the plan + `apps/docs/registry.json`. Mobile (Section 8) items are delivered as interactive web prototypes in **/flows** whose AI prompts target Expo + Reanimated 4; native Expo source is the next phase.


## 7.1 Foundations & providers

| ID | Status | Notes |
|---|---|---|
| `motion-provider` | ✅ | Live in docs |
| `smooth-scroll` | ✅ | Live in docs |
| `in-view` | 🟡 | Covered by `@kinetik/core useInView` |
| `animate-presence-route` | 🟡 | Covered by `transition-slide-stack` |
| `view-transition-link` | ⬜ |  |
| `easing-playground` | ⬜ |  |

## 7.2 Text animations

| ID | Status | Notes |
|---|---|---|
| `text-split-reveal` | ✅ | Live in docs |
| `text-blur-in` | ✅ | Live in docs |
| `text-scramble` | ✅ | Live in docs |
| `text-typewriter` | ✅ | Live in docs |
| `text-rotate` | ✅ | Live in docs |
| `number-ticker` | ✅ | Live in docs |
| `text-gradient-animated` | ✅ | Live in docs |
| `text-shimmer` | ✅ | Live in docs |
| `text-scroll-highlight` | ✅ | Live in docs |
| `text-highlighter` | ✅ | Live in docs |
| `text-variable-weight` | ⬜ |  |
| `text-velocity-marquee` | ⬜ |  |
| `text-on-path` | ⬜ |  |
| `text-3d-flip` | ⬜ |  |
| `text-glitch` | ⬜ |  |

## 7.3 Scroll & storytelling

| ID | Status | Notes |
|---|---|---|
| `scroll-reveal` | ✅ | Live in docs |
| `scroll-progress` | ✅ | Live in docs |
| `parallax-layer` | ✅ | Live in docs |
| `sticky-stack-cards` | ✅ | Live in docs |
| `horizontal-scroll-section` | ✅ | Live in docs |
| `pinned-story` | ⬜ |  |
| `image-sequence-scrub` | ⬜ |  |
| `zoom-through-hero` | ⬜ |  |
| `scroll-velocity-skew` | ⬜ |  |
| `scroll-collapse-header` | ⬜ |  |
| `scroll-video-scrub` | ⬜ |  |
| `scroll-snap-sections` | ⬜ |  |

## 7.4 Page & route transitions

| ID | Status | Notes |
|---|---|---|
| `vt-crossfade` | ⬜ |  |
| `vt-shared-element` | ✅ | Live in docs |
| `transition-curtain` | ⬜ |  |
| `transition-slide-stack` | ✅ | Live in docs |
| `transition-circle-reveal` | 🟡 | Covered by `theme-toggle` |
| `preloader-intro` | ⬜ |  |

## 7.5 Layout & FLIP

| ID | Status | Notes |
|---|---|---|
| `animated-tabs` | ✅ | Live in docs |
| `accordion-smooth` | ✅ | Live in docs |
| `expandable-card` | ✅ | Live in docs |
| `reorder-list` | ✅ | Live in docs |
| `auto-animate-list` | ✅ | Live in docs |
| `filter-grid-flip` | ⬜ |  |
| `layout-grid-toggle` | ⬜ |  |
| `dynamic-island` | ✅ | Live in docs |
| `morphing-popover` | ⬜ |  |

## 7.6 Buttons & micro-interactions

| ID | Status | Notes |
|---|---|---|
| `button-press` | ✅ | Live in docs |
| `button-shimmer` | ✅ | Live in docs |
| `button-magnetic` | ✅ | Live in docs |
| `button-border-beam` | ✅ | Live in docs |
| `button-stateful` | ✅ | Live in docs |
| `button-hold-confirm` | ✅ | Live in docs |
| `button-ripple` | ⬜ |  |
| `button-liquid` | ⬜ |  |
| `like-burst` | ✅ | Live in docs |
| `copy-button` | ✅ | Live in docs |
| `toggle-switch` | ✅ | Live in docs |
| `checkbox-draw` | ✅ | Live in docs |
| `theme-toggle` | ✅ | Live in docs |
| `animated-icon-set` | ⬜ |  |
| `rating-stars` | ⬜ |  |
| `confetti-trigger` | ⬜ |  |

## 7.7 Cursor & pointer effects

| ID | Status | Notes |
|---|---|---|
| `custom-cursor` | ⬜ |  |
| `spotlight` | ✅ | Live in docs |
| `tilt-card` | ✅ | Live in docs |
| `cursor-trail` | ⬜ |  |
| `follow-eyes` | ⬜ |  |

## 7.8 Backgrounds & ambient

| ID | Status | Notes |
|---|---|---|
| `bg-aurora` | ✅ | Live in docs |
| `bg-grid-dots` | ✅ | Live in docs |
| `bg-gradient-mesh` | ✅ | Live in docs |
| `bg-noise` | ✅ | Live in docs |
| `bg-beams` | ⬜ |  |
| `bg-meteors` | ✅ | Live in docs |
| `bg-particles` | ⬜ |  |
| `bg-shader-gradient` | ⬜ |  |
| `bg-ripple-grid` | ⬜ |  |
| `bg-starfield` | ⬜ |  |

## 7.9 Cards & surfaces

| ID | Status | Notes |
|---|---|---|
| `card-spotlight-border` | ✅ | Live in docs |
| `bento-grid` | ✅ | Live in docs |
| `card-glass` | ⬜ |  |
| `card-flip` | ⬜ |  |
| `card-stack-swipe` | ⬜ |  |
| `card-hover-reveal` | ⬜ |  |
| `animated-beam` | ✅ | Live in docs |

## 7.10 Navigation

| ID | Status | Notes |
|---|---|---|
| `navbar-hide-on-scroll` | ✅ | Live in docs |
| `menu-toggle-morph` | ✅ | Live in docs |
| `dock-magnify` | ✅ | Live in docs |
| `mega-menu` | ⬜ |  |
| `command-palette` | ⬜ |  |
| `breadcrumb-animated` | ⬜ |  |
| `sidebar-collapse` | ⬜ |  |

## 7.11 Overlays

| ID | Status | Notes |
|---|---|---|
| `dialog-animated` | ✅ | Live in docs |
| `drawer-draggable` | ✅ | Live in docs |
| `toast-stack` | ✅ | Live in docs |
| `tooltip-animated` | ✅ | Live in docs |
| `popover-morph` | ⬜ |  |
| `context-menu-animated` | ⬜ |  |

## 7.12 Loaders, progress & feedback

| ID | Status | Notes |
|---|---|---|
| `skeleton-shimmer` | ✅ | Live in docs |
| `spinner-set` | ✅ | Live in docs |
| `progress-bar-animated` | ✅ | Live in docs |
| `progress-ring` | ✅ | Live in docs |
| `success-check` | ✅ | Live in docs |
| `empty-state-animated` | ⬜ |  |
| `page-loader-bar` | ⬜ |  |

## 7.13 Data visualization motion

| ID | Status | Notes |
|---|---|---|
| `stat-counter-grid` | ✅ | Live in docs |
| `chart-bar-grow` | ✅ | Live in docs |
| `chart-line-draw` | ✅ | Live in docs |
| `chart-donut` | ⬜ |  |
| `globe-interactive` | ⬜ |  |
| `live-ticker` | ⬜ |  |

## 7.14 SVG & illustration

| ID | Status | Notes |
|---|---|---|
| `svg-path-draw` | ✅ | Live in docs |
| `svg-morph` | ⬜ |  |
| `svg-motion-path` | ⬜ |  |
| `rive-player` | ⬜ |  |
| `lottie-player` | ⬜ |  |

## 7.15 3D & WebGL

| ID | Status | Notes |
|---|---|---|
| `canvas-3d-shell` | ✅ | Live in docs |
| `hero-3d-model` | ⬜ |  |
| `image-distortion-hover` | ⬜ |  |
| `particles-morph` | ⬜ |  |
| `liquid-blob` | ⬜ |  |
| `infinite-gallery-3d` | ⬜ |  |

## 7.16 Media, carousels & galleries

| ID | Status | Notes |
|---|---|---|
| `marquee` | ✅ | Live in docs |
| `carousel-drag` | ✅ | Live in docs |
| `image-reveal-mask` | ✅ | Live in docs |
| `lightbox-shared` | ⬜ |  |
| `video-hover-preview` | ⬜ |  |
| `before-after-slider` | ⬜ |  |
| `cover-flow` | ⬜ |  |

## 7.17 Forms & inputs

| ID | Status | Notes |
|---|---|---|
| `input-floating-label` | ✅ | Live in docs |
| `otp-input` | ✅ | Live in docs |
| `form-stepper` | ✅ | Live in docs |
| `password-strength` | ✅ | Live in docs |
| `search-expand` | ⬜ |  |
| `file-dropzone` | ⬜ |  |
| `error-shake` | ✅ | Live in docs |

## 7.18 Blocks (full sections built from components)

| ID | Status | Notes |
|---|---|---|
| `hero-split-text` | ✅ | Live in docs |
| `hero-3d` | ⬜ |  |
| `hero-video-zoom` | ⬜ |  |
| `features-bento` | ✅ | Live in docs |
| `features-sticky-story` | ⬜ |  |
| `logo-cloud-marquee` | 🟡 | Covered by `social-proof-marquee` |
| `testimonials-wall` | 🟡 | Covered by `social-proof-marquee` |
| `pricing-toggle` | ✅ | Live in docs |
| `stats-section` | 🟡 | Covered by `stat-counter-grid` |
| `faq-accordion` | 🟡 | Covered by `faq-section` |
| `cta-spotlight` | ✅ | Live in docs |
| `footer-reveal` | ⬜ |  |
| `auth-card` | ✅ | Live in docs |
| `dashboard-shell` | ✅ | Live in docs |
| `portfolio-gallery` | ⬜ |  |
| `404-playful` | 🟡 | Covered by `not-found-playful` |
| `checkout-steps` | ✅ | Live in docs |

## 8.1 Foundations

| ID | Status | Notes |
|---|---|---|
| `native-motion-provider` | ⬜ |  |
| `pressable-scale` | ⬜ |  |
| `animated-presence-native` | ⬜ |  |

## 8.2 Micro-interactions

| ID | Status | Notes |
|---|---|---|
| `native-toggle` | ⬜ |  |
| `native-like-burst` | ⬜ |  |
| `native-button-stateful` | ⬜ |  |
| `native-checkbox` | ⬜ |  |
| `native-otp` | ⬜ |  |
| `native-segmented` | ⬜ |  |
| `native-counter` | ⬜ |  |

## 8.3 Gestures

| ID | Status | Notes |
|---|---|---|
| `swipe-row-actions` | ⬜ |  |
| `swipe-card-deck` | ⬜ |  |
| `bottom-sheet` | ⬜ |  |
| `pinch-zoom-image` | ⬜ |  |
| `drag-reorder-list` | ⬜ |  |
| `pull-to-refresh-custom` | ⬜ |  |
| `draggable-fab` | ⬜ |  |

## 8.4 Scroll & lists

| ID | Status | Notes |
|---|---|---|
| `collapsing-header` | ⬜ |  |
| `parallax-header-image` | ⬜ |  |
| `list-entering` | ⬜ |  |
| `sticky-section-headers` | ⬜ |  |
| `scroll-progress-native` | ⬜ |  |

## 8.5 Navigation & transitions

| ID | Status | Notes |
|---|---|---|
| `animated-tab-bar` | ⬜ |  |
| `shared-element-transition` | ⬜ |  |
| `dynamic-island-native` | ⬜ |  |
| `modal-scale-background` | ⬜ |  |
| `drawer-menu` | ⬜ |  |

## 8.6 Loading & feedback

| ID | Status | Notes |
|---|---|---|
| `native-skeleton` | ⬜ |  |
| `native-spinner-set` | ⬜ |  |
| `native-toast` | ⬜ |  |
| `native-progress-ring` | ⬜ |  |
| `native-success` | ⬜ |  |

## 8.7 Graphics (Skia)

| ID | Status | Notes |
|---|---|---|
| `skia-shader-bg` | ⬜ |  |
| `skia-blur-glass` | ⬜ |  |
| `skia-line-chart` | ⬜ |  |
| `skia-path-morph` | ⬜ |  |
| `skia-particles` | ⬜ |  |

## 8.8 Mobile flows (Mobbin-style blocks)

| ID | Status | Notes |
|---|---|---|
| `flow-onboarding` | 🟡 | Web prototype in /flows + Expo/Reanimated prompt; native source todo |
| `flow-paywall` | 🟡 | Web prototype in /flows + Expo/Reanimated prompt; native source todo |
| `flow-auth` | 🟡 | Web prototype in /flows + Expo/Reanimated prompt; native source todo |
| `flow-checkout` | 🟡 | Web prototype in /flows + Expo/Reanimated prompt; native source todo |
| `flow-profile-settings` | 🟡 | Web prototype in /flows + Expo/Reanimated prompt; native source todo |
| `flow-empty-error-states` | ⬜ |  |
| `flow-habit-check-in` | 🟡 | Web prototype in /flows + Expo/Reanimated prompt; native source todo |

## Built beyond the plan

`faq-section`, `not-found-playful`, `social-proof-marquee`
