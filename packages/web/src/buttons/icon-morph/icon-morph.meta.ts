import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "icon-morph",
  name: "Morphing Icons",
  description: "Icon strokes that morph between states — menu↔close, play↔pause, plus↔minus, arrow↔check — instead of crossfading.",
  category: "buttons",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["icons","morph","svg","toggle"],
  pageTypes: ["dashboard","media","landing"],
  inspiration: ["Animated icon sets (Lordicon, itshover)"],
  a11y: "Icon is aria-hidden; put the label/aria-pressed on the parent button.",
  perf: "Motion interpolates SVG `d` with matching point counts.",
  status: "stable",
  priority: "P2",
  previewHeight: 220,
  props: [
    { name: "kind", type: "\"menu-close\" | \"play-pause\" | \"plus-minus\" | \"arrow-check\"", description: "Which icon." },
    { name: "active", type: "boolean", description: "Second state." },
  ],
};
