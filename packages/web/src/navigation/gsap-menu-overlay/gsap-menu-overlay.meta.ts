import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-menu-overlay",
  name: "Interruptible Menu Overlay",
  description: "Full-screen menu as ONE paused timeline — panels wipe down, link letters rise from masks — played forward to open and reversed (faster) to close, so it can be interrupted at any point.",
  category: "navigation",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["menu","overlay","navigation","splittext","agency"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["GSAP Demo Hub — Interruptible single timeline enter/exit"],
  a11y: "Toggle has aria-expanded, links leave tab order when closed, Esc closes. Reduced motion: near-instant timeline.",
  perf: "Built once; play/reverse never rebuilds tweens.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "links", type: "{ label, href?, meta? }[]", description: "Links." },
    { name: "brand", type: "string", default: "\"studio®\"", description: "Logo text." },
  ],
};
