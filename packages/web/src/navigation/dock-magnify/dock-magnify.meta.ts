import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "dock-magnify",
  name: "Magnifying Dock",
  description: "The macOS Dock: icons swell based on cursor distance with springy, interruptible physics and hover labels.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["dock", "macos", "magnify", "toolbar", "apps"],
  pageTypes: ["portfolio", "dashboard"],
  inspiration: ["macOS Dock", "Build UI dock"],
  a11y: "Each icon is a labelled button; labels show on keyboard focus. No magnification on touch or reduced motion.",
  perf: "One shared mouseX motion value; per-icon springs; zero re-renders.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "items", type: "{ label, icon, onClick? }[]", description: "Dock icons." },
    { name: "base / max", type: "number", default: "44 / 76", description: "Rest and peak icon size (px)." },
    { name: "distance", type: "number", default: "140", description: "Influence radius (px)." },
  ],
};
