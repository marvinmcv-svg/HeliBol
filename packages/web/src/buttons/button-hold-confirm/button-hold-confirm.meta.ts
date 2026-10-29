import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-hold-confirm",
  name: "Hold to Confirm",
  description: "Destructive actions require a press-and-hold: a fill wipes across the button and reverses smoothly if released early.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["destructive", "confirm", "delete", "safety", "hold"],
  pageTypes: ["settings", "dashboard"],
  inspiration: ["Emil Kowalski hold-to-delete", "iOS long-press"],
  a11y: "Works with keyboard: hold Enter or Space. aria-label explains the hold. Avoids a modal for low-stakes confirmations.",
  perf: "Single clip-path driven by a motion value.",
  status: "stable",
  priority: "P2",
  previewHeight: 240,
  props: [
    { name: "onConfirm", type: "() => void", description: "Fires when the hold completes." },
    { name: "holdDuration", type: "number", default: "1.4", description: "Seconds to hold." },
    { name: "confirmedLabel", type: "ReactNode", default: '"Deleted"', description: "Label after confirming." },
  ],
};
