import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-feature-carousel",
  name: "Hero — Feature Carousel",
  description: "Feature-led hero: condensed uppercase headline with arrow controls driving a spring-physics card slider that also auto-advances.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","ai","video","carousel","slider","condensed"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["Mobbin — VEED hero (mobbin.com/sites/sections/601cbc8b-0e7e-42b5-8d6f-3c5b73d23313)"],
  a11y: "Arrow buttons are labelled; off-screen cards are aria-hidden; hover pauses auto-advance; reduced motion disables autoplay and snaps.",
  perf: "One spring translateX on the track; interval paused on hover.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
