import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "footer-reveal", name: "Footer Reveal", category: "navigation", platforms: ["web"], engine: "css",
  description: "Sticky reveal footer: the page lifts away like a sheet to uncover a fixed footer with a giant wordmark, rolling links and newsletter.",
  dependencies: ["motion"], registryDependencies: ["kinetik-core", "text-roll-hover", "button-subscribe"], tags: ["footer", "reveal", "sticky", "agency"],
  pageTypes: ["landing", "portfolio"], a11y: "Real footer landmark and links; no motion needed to reach content.", perf: "Pure CSS clip-path + fixed positioning trick.",
  status: "stable", priority: "P2", previewHeight: 460,
};
