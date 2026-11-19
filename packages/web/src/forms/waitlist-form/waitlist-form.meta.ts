import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "waitlist-form",
  name: "Waitlist Form",
  description: "Waitlist signup: the email pill morphs into a success pill with your place in line, the joined counter rolls up, your avatar pops into the stack, and invalid input shakes with a message.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["waitlist","email","signup","launch","form"],
  pageTypes: ["landing"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "Labelled email input with aria-invalid and an assertive error message; success is role=status. Reduced motion: no shake or morph.",
  perf: "One shared layoutId morph; counter via motion value (no re-renders per frame).",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "count", type: "number", description: "People already joined." },
    { name: "avatars", type: "string[]", default: "[]", description: "Avatar URLs." },
    { name: "onJoin", type: "(email) => Promise<void>", default: "fake 900 ms", description: "Submit handler." },
  ],
};
