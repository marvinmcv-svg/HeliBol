import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-wiggle",
  name: "CustomWiggle Attention",
  description: "Attention micro-interactions with CustomWiggle: a bell that rings, an input error shake, a jelly squash and a nudge — each always returns exactly to rest.",
  category: "buttons",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["wiggle","shake","error","notification","micro-interaction"],
  pageTypes: ["dashboard","auth","landing"],
  inspiration: ["GSAP Demo Hub — CustomWiggle"],
  a11y: "Wraps your own control; pair the error shake with aria-invalid + message. Reduced motion: a soft opacity pulse.",
  perf: "One tween whose ease is the oscillation.",
  status: "stable",
  priority: "P1",
  previewHeight: 360,
  props: [
    { name: "kind", type: "\"ring\" | \"shake\" | \"jelly\" | \"nudge\"", default: "\"ring\"", description: "Wiggle style." },
    { name: "onHover", type: "boolean", default: "false", description: "Also play on hover." },
    { name: "trigger", type: "unknown", description: "Change to fire programmatically." },
  ],
};
