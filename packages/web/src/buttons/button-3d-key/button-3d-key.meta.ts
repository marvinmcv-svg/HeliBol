import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-3d-key",
  name: "Button — 3D Key",
  description: "Chunky mechanical-key button with a real edge: the cap lifts on hover and sinks to the base on press, with a soft shadow that shrinks and grows. Colour and depth are CSS variables.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","button","3d","key","keyboard","tactile","game"],
  pageTypes: ["landing","onboarding"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Native button; visible focus ring; reduced motion removes the transitions but keeps the pressed state.",
  perf: "Pure CSS transforms on three span layers.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "color", type: "string", default: "#f43f5e", description: "Key colour." },
    { name: "depth", type: "number", default: "6", description: "Edge depth in px." },
    { name: "children", type: "ReactNode", description: "Label." },
    { name: "...button", type: "ButtonHTMLAttributes", description: "Native button props." },
  ],
};
