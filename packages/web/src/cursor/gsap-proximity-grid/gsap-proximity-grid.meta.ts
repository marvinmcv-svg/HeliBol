import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-proximity-grid",
  name: "Proximity Scale Grid",
  description: "Icon tiles swell and brighten by how close they are to the cursor — distance mapped to 0..1 with gsap.utils.mapRange — then settle back with an elastic ripple.",
  category: "cursor",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["hover","grid","proximity","icons","playful"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["GSAP Demo Hub — Proximity scale grid"],
  a11y: "Tiles are presentational; put real controls inside if needed. Effect is pointer-only (off on touch) and disabled under reduced motion.",
  perf: "One overwrite:true tween per tile per pointermove; transforms + filter only.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "items", type: "ReactNode[]", description: "Tile contents." },
    { name: "radius", type: "number", default: "180", description: "Influence radius in px." },
    { name: "maxScale", type: "number", default: "1.9", description: "Scale under the cursor." },
    { name: "columns", type: "number", default: "6", description: "Grid columns." },
  ],
};
