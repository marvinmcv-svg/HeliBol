import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-voice-call",
  name: "AI — Voice Call",
  description: "Voice-assistant call screen: a liquid orb that breathes while listening, swirls while thinking and pulses with the voice while speaking, live word-by-word captions, a call timer, mute and hang-up.",
  category: "ai",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","ai","voice","assistant","orb","captions","call"],
  pageTypes: ["ai-app"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Captions are an aria-live region; state is announced; controls are labelled buttons. Reduced motion keeps the orb static and shows full captions.",
  perf: "Orb animates transform/opacity only; captions reveal one word per tick.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "turns", type: "{ who: 'user' | 'agent'; text: string }[]", description: "Conversation to play back." },
    { name: "agentName", type: "string", default: "Nova", description: "Assistant name." },
  ],
};
