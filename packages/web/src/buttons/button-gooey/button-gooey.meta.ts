import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-gooey",
  name: "Gooey Liquid Button",
  description: "Blobs bubble out from the pill on hover and fuse with it through an SVG goo filter — a liquid, organic hover.",
  category: "buttons",
  platforms: ["web"],
  engine: "svg",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["gooey","liquid","svg filter","playful"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Lucas Bebber gooey effect","React Bits Gooey Nav"],
  a11y: "Label is outside the filtered layer so text stays crisp; blobs hidden under reduced motion.",
  perf: "SVG filter on a small area; CSS transitions.",
  status: "stable",
  priority: "P2",
  previewHeight: 220,
  props: [
    { name: "...props", type: "ButtonHTMLAttributes", description: "Native button props." },
  ],
};
