import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "mockup-iphone",
  name: "iPhone Mockup",
  description: "Pure-CSS iPhone frame — titanium bezel, Dynamic Island and side buttons — that wraps any screen or screenshot.",
  category: "mockups",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["mockup","iphone","device","frame","css-only"],
  pageTypes: ["landing","onboarding"],
  inspiration: ["Magic UI iPhone 15 Pro"],
  a11y: "Frame is presentational; give screenshots meaningful alt text.",
  perf: "No images for the frame; 0 KB JS.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "children", type: "ReactNode", description: "Screen content." },
  ],
};
