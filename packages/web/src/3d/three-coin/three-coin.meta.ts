import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "three-coin",
  name: "3D Coin Flip",
  description: "A metallic coin with canvas-drawn embossed faces. It flips on a spring with a little hop and tilts toward the pointer — fintech/rewards hero.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three","@react-three/fiber","@react-three/drei"],
  registryDependencies: ["kinetik-core","canvas-3d-shell"],
  tags: ["three.js","coin","fintech","rewards","flip"],
  pageTypes: ["landing","ecommerce"],
  inspiration: ["MotionSites — Fin Coin"],
  a11y: "Decorative; announce results in HTML (demo uses aria-live). Reduced motion: flips snap to the final face.",
  perf: "CanvasTexture faces generated once; one cylinder with three material groups.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "front", type: "string", default: "'K'", description: "Front mark." },
    { name: "back", type: "string", default: "'KINETIK · 2026'", description: "Back text." },
    { name: "color", type: "string", default: "'#d4a017'", description: "Metal colour." },
    { name: "flipKey", type: "number", default: "0", description: "Increment to flip." },
  ],
};
