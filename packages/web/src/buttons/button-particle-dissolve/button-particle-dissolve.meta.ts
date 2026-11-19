import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-particle-dissolve",
  name: "Particle Dissolve Button",
  description: "On click the button disintegrates: it's sampled into ~600 particles that drift away like sand in the wind (a left-to-right sweep), then a success pill springs in where it stood.",
  category: "buttons",
  platforms: ["web"],
  engine: "canvas",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","button","particles","thanos","success","canvas"],
  pageTypes: ["landing","social"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Success state is role=status; button disabled during the effect. Reduced motion: direct swap to success.",
  perf: "Canvas only exists for ~2 s; particle count capped.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "onAction", type: "() => Promise<void> | void", description: "Run before dissolving." },
    { name: "doneLabel", type: "string", default: "'Sent'", description: "Success text." },
    { name: "color", type: "string", default: "button bg", description: "Particle colour." },
  ],
};
