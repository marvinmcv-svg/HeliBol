import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-radial-menu",
  name: "Radial Action Menu",
  description: "A FAB blooms into a ring of actions with a bouncy stagger — and closes with a different, crisp ease instead of replaying the bounce backwards.",
  category: "navigation",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["fab","menu","radial","actions","mobile"],
  pageTypes: ["social","dashboard"],
  inspiration: ["GSAP Demo Hub — Radial Menu / easeReverse"],
  a11y: "Toggle has aria-expanded; hidden actions are removed from tab order; each action has a label. Reduced motion places items instantly.",
  perf: "One tween per item; positions precomputed from angle.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "items", type: "{ label, icon, onSelect? }[]", description: "Actions." },
    { name: "radius", type: "number", default: "96", description: "Orbit radius (px)." },
    { name: "arc", type: "number", default: "360", description: "Spread in degrees." },
    { name: "startAngle", type: "number", default: "-90", description: "First item angle." },
  ],
};
