import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cookie-consent",
  name: "Cookie Consent",
  description: "A polite consent card: slides up after a short delay, Customise expands per-category switches in place, and Accept and Reject are equally prominent — no dark patterns. The choice is remembered.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["cookie","consent","gdpr","privacy","banner"],
  pageTypes: ["landing","ecommerce"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "Non-modal labelled dialog; switches have names; required category disabled. Reduced motion: fades only.",
  perf: "Mounts after delay; height-auto expansion only on demand.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "categories", type: "{ id, label, description, required? }[]", default: "3 defaults", description: "Consent categories." },
    { name: "storageKey", type: "string", description: "Remember the decision." },
    { name: "onDecide", type: "(granted) => void", description: "Callback." },
    { name: "delay", type: "number", default: "600", description: "ms before showing." },
  ],
};
