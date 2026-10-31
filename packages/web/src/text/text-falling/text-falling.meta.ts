import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-falling",
  name: "Falling Letters",
  description: "Click the headline and its letters drop with gravity, bounce off the floor and tumble; click again to spring them back.",
  category: "text",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["physics","gravity","playful","easter egg"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["React Bits Falling Text","Fancy gravity"],
  a11y: "It's a real button with a descriptive label; reduced motion just toggles positions.",
  perf: "Tiny custom integrator; stops when settled.",
  status: "stable",
  priority: "P3",
  previewHeight: 320,
  props: [
    { name: "gravity", type: "number", default: "2400", description: "px/s²." },
  ],
};
