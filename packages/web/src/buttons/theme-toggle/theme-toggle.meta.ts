import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "theme-toggle",
  name: "Theme Toggle + Circle Reveal",
  description: "Sun morphs into a moon with springs, and the new theme expands from the button as a circle using the View Transitions API.",
  category: "buttons",
  platforms: ["web"],
  engine: "view-transitions",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["dark mode", "theme", "view transitions", "icon morph"],
  pageTypes: ["landing", "docs", "dashboard", "settings"],
  inspiration: ["Telegram theme switch", "Chrome View Transitions demos"],
  a11y: "Real <button> with a descriptive aria-label that reflects the next theme. Reduced motion or no VT support: instant switch.",
  perf: "The reveal is a single clip-path animation on the browser's snapshot layer — no repaint of your DOM during the transition.",
  status: "stable",
  priority: "P1",
  previewHeight: 280,
  props: [
    { name: "theme", type: '"light" | "dark"', description: "Controlled theme; omit to let it manage <html class=\"dark\">." },
    { name: "onThemeChange", type: "(t) => void", description: "Called with the next theme (e.g. wire to next-themes' setTheme)." },
    { name: "reveal", type: "boolean", default: "true", description: "Enable the circular View Transition." },
  ],
};
