import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "input-floating-label",
  name: "Floating Label Input",
  description: "Material-style floating label driven entirely by CSS (:focus and :placeholder-shown) with a center-out focus underline.",
  category: "forms",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["input", "form", "floating label", "css-only"],
  pageTypes: ["auth", "settings", "ecommerce"],
  inspiration: ["Material Design text fields", "Stripe Checkout"],
  a11y: "Real <label for>; errors linked via aria-describedby and aria-invalid.",
  perf: "Pure CSS peer selectors; server-component safe.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "label", type: "string", description: "Floating label." },
    { name: "error", type: "string", description: "Error text (sets aria-invalid)." },
    { name: "...props", type: "InputHTMLAttributes", description: "Native input props (placeholder is reserved)." },
  ],
};
