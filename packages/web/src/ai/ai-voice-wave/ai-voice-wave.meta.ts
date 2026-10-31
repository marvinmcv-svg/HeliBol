import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-voice-wave",
  name: "Voice Input Wave",
  description: "Mic button that expands into live waveform bars and a timer — plug in an AnalyserNode for real levels.",
  category: "ai",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["voice","microphone","waveform","recording"],
  pageTypes: ["ai-app","social"],
  inspiration: ["WhatsApp voice notes","ChatGPT voice"],
  a11y: "aria-pressed mic button with clear labels; timer has role=timer; bars aria-hidden.",
  perf: "Bars update ~11×/s with springs.",
  status: "stable",
  priority: "P2",
  previewHeight: 240,
  props: [
    { name: "levels", type: "number[]", description: "External levels 0–1 per bar." },
    { name: "bars", type: "number", default: "24", description: "Bar count." },
  ],
};
