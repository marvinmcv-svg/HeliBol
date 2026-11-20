import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-slide-confirm",
  name: "Button — Slide to Confirm",
  description: "Slide-to-confirm control for risky actions: drag the knob along the track, the fill follows and the label shimmers and fades; past 85% it completes with a check, otherwise it springs back.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","button","slide","confirm","drag","payment","unlock"],
  pageTypes: ["ecommerce","settings","dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Role=slider with aria-valuenow; Enter/Space/→/End complete it from the keyboard. Reduced motion removes the shimmer.",
  perf: "Drag on one motion value; fill and label opacity are derived transforms.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "label", type: "string", default: "Slide to pay", description: "Track label." },
    { name: "doneLabel", type: "string", default: "Paid", description: "Label after completion." },
    { name: "onConfirm", type: "() => void", description: "Fires on completion." },
    { name: "width", type: "number", default: "300", description: "Track width in px." },
  ],
};
