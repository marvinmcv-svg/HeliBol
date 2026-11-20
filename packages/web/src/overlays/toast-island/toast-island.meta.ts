import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "toast-island",
  name: "Toast — Dynamic Island",
  description: "Dynamic-Island-style notifications: a black pill at the top morphs in width and height to show loading, success or error, with a promise() helper that walks through the states and an optional detail line.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","toast","notification","dynamic-island","promise","morph"],
  pageTypes: ["dashboard","ai-app","ecommerce"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Island is a role=status live region; dismisses after a timeout but pauses on hover.",
  perf: "One element morphing via layout; icons swap with AnimatePresence.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "children", type: "ReactNode", description: "App content (provider)." },
    { name: "useIsland()", type: "{ show, promise }", description: "Hook to trigger notifications." },
  ],
};
