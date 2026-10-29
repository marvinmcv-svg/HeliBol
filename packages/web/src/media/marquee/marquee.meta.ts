import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "marquee",
  name: "Marquee",
  description: "Seamless infinite marquee for logos and testimonials: horizontal or vertical, reverse, edge fade, pause on hover and an optional pause button.",
  category: "media",
  platforms: ["web"],
  engine: "css",
  dependencies: ["lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["marquee", "logos", "testimonials", "infinite", "ticker"],
  pageTypes: ["landing", "pricing"],
  inspiration: ["Magic UI Marquee", "Vercel customer logos"],
  a11y: "Duplicate track is aria-hidden; pause control satisfies WCAG 2.2.2; paused entirely under reduced motion.",
  perf: "One transform keyframe per track, compositor-only.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "duration", type: "number", default: "30", description: "Seconds per loop." },
    { name: "reverse / vertical", type: "boolean", description: "Direction / axis." },
    { name: "pauseOnHover", type: "boolean", default: "true", description: "Pause while hovered." },
    { name: "fade", type: "boolean", default: "true", description: "Edge mask." },
    { name: "controls", type: "boolean", default: "false", description: "Pause/play button." },
    { name: "gap", type: "string", default: '"2rem"', description: "Space between items." },
  ],
};
