import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "date-picker",
  name: "Date Picker",
  description: "Popover calendar that springs open from its field: months slide in the direction you navigate, the selection circle glides between days and the full ARIA grid keyboard model works.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["date","calendar","picker","popover","booking"],
  pageTypes: ["ecommerce","settings","dashboard"],
  inspiration: ["21st.dev — Calendars / Date pickers"],
  a11y: "Button with aria-haspopup=dialog; grid of gridcells with roving tabindex; Arrows, Home/End, PageUp/PageDown, Enter, Esc. Locale-aware labels via Intl. Reduced motion: fades only.",
  perf: "42 day buttons per month; only the visible month mounts.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "value", type: "Date | null", default: "null", description: "Initial date." },
    { name: "onChange", type: "(d: Date) => void", description: "Selection callback." },
    { name: "locale", type: "string", default: "'en-US'", description: "Intl locale." },
    { name: "weekStart", type: "0 | 1", default: "1", description: "First weekday." },
    { name: "label", type: "string", default: "'Date'", description: "Field label." },
  ],
};
