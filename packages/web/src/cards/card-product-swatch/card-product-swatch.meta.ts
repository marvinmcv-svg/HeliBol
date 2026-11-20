import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-product-swatch",
  name: "Card — Product Swatches",
  description: "Product card that changes with the colourway: picking a swatch floods the backdrop with the new colour, the product swings out and the next swings in from that side, name and price roll, and the selection ring glides. Add to bag morphs into a check.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","card","product","ecommerce","swatch","variant","shop"],
  pageTypes: ["ecommerce"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Swatches are a radiogroup with names; the button announces the added state. Reduced motion cross-fades.",
  perf: "AnimatePresence popLayout for the image and rolling text; one layoutId ring.",
  status: "stable",
  priority: "P1",
  previewHeight: 520,
  props: [
    { name: "title", type: "string", description: "Product name." },
    { name: "subtitle", type: "string", description: "Secondary line." },
    { name: "variants", type: "{ name; color; image; price }[]", description: "Colourways." },
    { name: "currency", type: "string", default: "$", description: "Currency symbol." },
  ],
};
