import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-blueprint",
  name: "Hero — Blueprint Grid",
  description: "Architectural/AI-tool hero on a ruled editorial grid: line-art tower drawn stroke by stroke, a red sun popping behind it and a mono ticker.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","editorial","grid","line art","path draw","ticker","architecture"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["Mobbin — Heron AI hero (mobbin.com/sites/sections/d9f918f2-ab01-4524-981b-8a66efb735f4)"],
  a11y: "Heading and statement are real text; the SVG drawing is aria-hidden; reduced motion shows the finished drawing with no ticker.",
  perf: "SVG stroke-dashoffset draws (~15 paths) run once; one ticker loop.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
