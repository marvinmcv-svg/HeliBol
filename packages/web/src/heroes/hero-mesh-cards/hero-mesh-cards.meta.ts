import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-mesh-cards",
  name: "Hero — Mesh + Floating Cards",
  description: "Fintech/SaaS hero: drifting mesh gradient, blur-in headline and CTAs, and floating product cards bobbing at different rhythms.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","saas","fintech","mesh gradient","floating cards"],
  pageTypes: ["landing"],
  inspiration: ["Stripe homepage","21st.dev Heroes"],
  a11y: "Real h1 and links; decorative cards aria-hidden; bobbing and mesh stop under reduced motion.",
  perf: "@property mesh in CSS; three small looping transforms.",
  status: "stable",
  priority: "P1",
  previewHeight: 520,
  props: [
    { name: "title / subtitle", type: "string", description: "Copy." },
  ],
};
