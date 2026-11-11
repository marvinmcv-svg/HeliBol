import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-hover-preview",
  name: "Hover Image Preview List",
  description: "Agency project index: hovering a row reveals its image in a card that trails the cursor, tilts with your speed and clip-reveals between projects.",
  category: "cursor",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["portfolio","list","hover","image","agency"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["GSAP Demo Hub — Cursor-Tracking Image Preview","Awwwards studio sites"],
  a11y: "Rows are real links; focus also reveals the preview; image is decorative (aria-hidden). Reduced motion keeps the list behaviour without the floating card.",
  perf: "gsap.quickTo for x/y/rotation (no new tweens per move); images stacked and clip-revealed.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "items", type: "{ title, meta, image, href? }[]", description: "Projects." },
  ],
};
