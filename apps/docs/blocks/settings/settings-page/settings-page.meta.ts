import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "settings-page", name: "Settings Page", category: "forms", platforms: ["web"], engine: "motion",
  description: "Settings screen: collapsible sidebar, spring toggles, animated select, tag input and a hold-to-confirm danger zone.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core", "nav-sidebar", "toggle-switch", "select-animated", "tag-input", "button-hold-confirm"], tags: ["settings", "preferences", "account", "app shell"],
  pageTypes: ["settings", "dashboard"], a11y: "Switches, listbox and hold button are all keyboard operable.", perf: "Small layout animations only.",
  status: "stable", priority: "P1", previewHeight: 620,
};
