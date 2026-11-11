import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-flip-modal",
  name: "Flip Grid Modal",
  description: "Click a thumbnail and the very same image node flies from the grid into a product dialog (Flip), text staggers in; closing flies it back home.",
  category: "layout",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["flip","modal","gallery","shared element","ecommerce"],
  pageTypes: ["ecommerce","portfolio"],
  inspiration: ["GSAP Demo Hub — Flip gallery modal / Simple grid Flip modal"],
  a11y: "Dialog has role=dialog, aria-modal, focus moves to Close, Esc and backdrop close it.",
  perf: "Single node re-parented; Flip.from with scale.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "items", type: "{ id, image, title, body }[]", description: "Items." },
  ],
};
