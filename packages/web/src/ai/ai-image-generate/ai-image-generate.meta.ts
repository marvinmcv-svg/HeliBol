import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-image-generate",
  name: "AI Image Generation",
  description: "Diffusion-style generation preview: coloured noise resolves to the final image through decaying blur and noise while a scan light sweeps, a step counter and progress ring tick up, and the prompt types out.",
  category: "ai",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","ai","image generation","diffusion","progress","creative"],
  pageTypes: ["ai-app"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Progress announced via aria-live; final image gets the prompt as alt text. Reduced motion: shows the result immediately.",
  perf: "64×64 noise canvas scaled up; CSS filters on one image.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "image", type: "string", description: "Final image." },
    { name: "prompt", type: "string", description: "Prompt text." },
    { name: "duration", type: "number", default: "4.5", description: "Seconds." },
    { name: "runKey", type: "number", default: "0", description: "Increment to rerun." },
  ],
};
