import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "radio-cards",
  name: "Radio Cards",
  description: "Selectable option cards built on native radio inputs; a highlight ring glides between cards with shared layout and the dot springs in.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["radio","cards","select","checkout","plans"],
  pageTypes: ["ecommerce","pricing","onboarding"],
  inspiration: ["21st.dev — Radio groups"],
  a11y: "Native radios (sr-only) inside labels inside a fieldset/legend, so arrow keys and forms work; focus ring via :has(:focus-visible). Reduced motion: instant.",
  perf: "One layoutId element moves between cards.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "options", type: "{ value, title, description?, icon?, aside? }[]", description: "Options." },
    { name: "value", type: "string", description: "Selected value." },
    { name: "onChange", type: "(v) => void", description: "Change handler." },
    { name: "label", type: "string", description: "Legend." },
  ],
};
