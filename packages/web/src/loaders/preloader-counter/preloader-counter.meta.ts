import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "preloader-counter",
  name: "Counter Preloader",
  description: "Brand intro: a huge counter races to 100 on an ease-out curve, then the panel wipes up to reveal the page. Skippable.",
  category: "loaders",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["preloader","intro","counter","agency"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["Awwwards agency preloaders"],
  a11y: "role=status with the percentage; Skip button; never shown under reduced motion.",
  perf: "rAF counter; clip-path wipe.",
  status: "stable",
  priority: "P3",
  previewHeight: 400,
  props: [
    { name: "duration", type: "number", default: "2.2", description: "Seconds to 100." },
    { name: "children", type: "ReactNode", description: "Page underneath." },
  ],
};
