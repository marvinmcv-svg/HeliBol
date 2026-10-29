import type { Category, Engine, PageType } from "@web/types";

export const categories: { id: Category; name: string; blurb: string }[] = [
  { id: "text", name: "Text", blurb: "Split reveals, scramble, typewriters, tickers" },
  { id: "buttons", name: "Buttons & Micro", blurb: "Press, shimmer, magnetic, stateful, toggles" },
  { id: "scroll", name: "Scroll & Story", blurb: "Reveals, parallax, sticky stacks, horizontal" },
  { id: "layout", name: "Layout & FLIP", blurb: "Tabs, accordions, expanding cards, reorder" },
  { id: "backgrounds", name: "Backgrounds", blurb: "Aurora, mesh gradients, grids, meteors" },
  { id: "cards", name: "Cards & Surfaces", blurb: "Spotlight borders, bento, beams" },
  { id: "cursor", name: "Cursor & Pointer", blurb: "Spotlight, tilt, pointer-reactive" },
  { id: "navigation", name: "Navigation", blurb: "Hide-on-scroll navbars, menus, docks" },
  { id: "overlays", name: "Overlays", blurb: "Dialogs, drawers, toasts, tooltips" },
  { id: "loaders", name: "Loaders & Feedback", blurb: "Skeletons, spinners, progress, success" },
  { id: "forms", name: "Forms & Inputs", blurb: "Floating labels, OTP, steppers, shake" },
  { id: "media", name: "Media & Carousels", blurb: "Marquees, drag carousels, image reveals" },
  { id: "transitions", name: "Page Transitions", blurb: "View Transitions, shared elements, theme" },
  { id: "data", name: "Data Viz", blurb: "KPI tickers, line draws, charts" },
  { id: "svg", name: "SVG", blurb: "Path drawing, morphing, motion paths" },
  { id: "3d", name: "3D & WebGL", blurb: "R3F canvas, shaders, particles" },
  { id: "foundations", name: "Foundations", blurb: "Providers, smooth scroll, in-view" },
];

export const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

export const engines: Record<Engine, { name: string; color: string }> = {
  css: { name: "CSS", color: "bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-sky-500/30" },
  motion: { name: "Motion", color: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 ring-fuchsia-500/30" },
  gsap: { name: "GSAP", color: "bg-lime-500/15 text-lime-700 dark:text-lime-300 ring-lime-500/30" },
  lenis: { name: "Lenis", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-500/30" },
  r3f: { name: "R3F", color: "bg-orange-500/15 text-orange-700 dark:text-orange-300 ring-orange-500/30" },
  "view-transitions": { name: "View Transitions", color: "bg-teal-500/15 text-teal-700 dark:text-teal-300 ring-teal-500/30" },
  canvas: { name: "Canvas", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-rose-500/30" },
  svg: { name: "SVG", color: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 ring-indigo-500/30" },
};

export const pageTypes: Record<PageType, string> = {
  landing: "Landing",
  pricing: "Pricing",
  auth: "Auth",
  dashboard: "Dashboard",
  portfolio: "Portfolio",
  blog: "Blog",
  ecommerce: "E-commerce",
  docs: "Docs",
  settings: "Settings",
  onboarding: "Onboarding",
};
