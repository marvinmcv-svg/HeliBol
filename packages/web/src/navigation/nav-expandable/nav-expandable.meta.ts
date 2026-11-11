import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-expandable",
  name: "Expandable Floating Nav",
  description: "A floating pill navbar that morphs into a full menu card with shared layout: the surface grows, links stagger in with blur, and Esc or outside click collapses it.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["navbar","menu","morph","floating","pill"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["unlumen UI — Expandable Navbar"],
  a11y: "Toggle has aria-expanded/aria-controls; Esc closes and returns focus; links are real anchors. Reduced motion: instant open.",
  perf: "One layout animation on the container; children use layout=\"position\" to avoid distortion.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "brand", type: "ReactNode", description: "Logo/brand." },
    { name: "links", type: "{ label, href, description? }[]", description: "Menu links." },
    { name: "cta", type: "ReactNode", description: "Optional CTA in the panel." },
  ],
};
