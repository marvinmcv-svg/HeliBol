import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-aurora",
  name: "Aurora Background",
  description: "Three heavily blurred color blobs drift on out-of-phase loops behind your hero. Pure CSS, theme-friendly.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["background", "aurora", "gradient", "hero", "ambient", "css-only"],
  pageTypes: ["landing", "auth", "pricing"],
  inspiration: ["Aceternity Aurora", "Stripe gradient"],
  a11y: "aria-hidden decoration. Slow, low-contrast motion; paused under reduced motion. Check text contrast over the brightest blob.",
  perf: "Transforms on 3 blurred layers. For long pages, unmount when off-screen.",
  status: "stable",
  priority: "P1",
  previewHeight: 340,
  props: [
    { name: "colors", type: "[string, string, string]", description: "Blob colors." },
    { name: "speed", type: "number", default: "14", description: "Seconds per drift cycle." },
  ],
};
