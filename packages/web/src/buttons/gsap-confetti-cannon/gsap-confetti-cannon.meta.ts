import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-confetti-cannon",
  name: "Physics Confetti Cannon",
  description: "Click the button and it fires projectile confetti — Physics2D velocity, angle and gravity so pieces arc and fall naturally while flipping in 3D.",
  category: "buttons",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["confetti","celebration","physics","success","button"],
  pageTypes: ["ecommerce","onboarding","dashboard"],
  inspiration: ["GSAP Demo Hub — Create physics-based effects"],
  a11y: "Pieces are aria-hidden and non-interactive; the wrapped button stays the control. No confetti under reduced motion.",
  perf: "60 small elements, removed on complete; transforms + opacity.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "count", type: "number", default: "60", description: "Pieces per burst." },
    { name: "colors", type: "string[]", default: "6 colours", description: "Palette." },
    { name: "angle", type: "number", default: "-90", description: "Launch angle." },
    { name: "spread", type: "number", default: "70", description: "Cone width." },
    { name: "onFire", type: "() => void", description: "Callback." },
  ],
};
