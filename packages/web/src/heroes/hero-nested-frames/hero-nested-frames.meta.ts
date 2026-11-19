import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-nested-frames",
  name: "Hero — Nested Frames",
  description: "Manifesto hero: white nav bar over a deep-purple field where the copy sits in a glowing rounded panel wrapped by concentric frames that pulse outward.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","manifesto","concentric","frames","glow","purple"],
  pageTypes: ["landing"],
  inspiration: ["Mobbin — Mixpanel hero (mobbin.com/sites/sections/d703e7fa-cd28-4f67-867d-c35986886af1)"],
  a11y: "Real h1; frames are aria-hidden; scroll cue is a labelled link; all pulses stop under reduced motion.",
  perf: "Three bordered divs with box-shadow pulses plus one @property gradient shift.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
