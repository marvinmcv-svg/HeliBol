import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "badge-animated",
  name: "Animated Badges",
  description: "Four badge behaviours: a pinging live dot, a metallic shine sweep, a counter that bumps and rolls when it changes (99+ cap), and a presence status dot.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["badge","counter","live","status","notification"],
  pageTypes: ["dashboard","social"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "Counter has an aria-label with the full number; status text visible. Reduced motion: no ping/shine, numbers swap.",
  perf: "CSS keyframes for ping and shine; Motion only for the counter.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "variant", type: "'live' | 'shine' | 'count' | 'status'", default: "'live'", description: "Behaviour." },
    { name: "count", type: "number", default: "0", description: "Counter value." },
    { name: "status", type: "'online' | 'away' | 'busy' | 'offline'", default: "'online'", description: "Presence." },
  ],
};
