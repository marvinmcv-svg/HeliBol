import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "canvas-3d-shell",
  name: "3D Canvas Shell",
  description: "A production-ready React Three Fiber canvas: clamped DPR, pauses off-screen and in background tabs, reduced-motion aware, lazy-loadable.",
  category: "3d",
  platforms: ["web"],
  engine: "r3f",
  dependencies: ["three", "@react-three/fiber", "@react-three/drei"],
  registryDependencies: ["kinetik-core"],
  tags: ["3d", "webgl", "three.js", "r3f", "hero"],
  pageTypes: ["landing", "portfolio"],
  inspiration: ["pmndrs examples", "Lusion"],
  a11y: "Canvas is decorative — keep meaningful content in HTML. Reduced motion: renders a still frame.",
  perf: "frameloop switches to 'demand' when off-screen/hidden; DPR clamped to 2. Always lazy-load (next/dynamic, ssr:false).",
  status: "beta",
  priority: "P1",
  previewHeight: 400,
  props: [
    { name: "maxDpr", type: "number", default: "2", description: "Device pixel ratio cap." },
    { name: "camera", type: "{ position?, fov? }", description: "Camera settings." },
    { name: "fallback", type: "ReactNode", description: "Suspense fallback while assets load." },
  ],
};
