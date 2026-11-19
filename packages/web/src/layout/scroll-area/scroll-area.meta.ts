import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "scroll-area",
  name: "Scroll Area",
  description: "Native scrolling with a custom overlay scrollbar that appears while scrolling or hovering, grows when grabbed and can be dragged; top/bottom fades appear only when there is more content that way.",
  category: "layout",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["scrollbar","scroll","overflow","list","fade"],
  pageTypes: ["dashboard","docs"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "The viewport is a focusable labelled region using native scroll, so keyboard, wheel, touch and screen readers work unchanged. Reduced motion: no mask transition.",
  perf: "One ResizeObserver; scroll handler updates two numbers; native scrollbar hidden.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "label", type: "string", description: "Region name." },
    { name: "fade", type: "number", default: "32", description: "Edge fade size in px." },
  ],
};
