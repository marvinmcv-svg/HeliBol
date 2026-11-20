import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "input-password-peek",
  name: "Password Peek",
  description: "Password field with character: an eye whose lid opens to reveal — letters scramble from dots into real characters left-to-right — and closes to hide; the pupil follows the caret as you type.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","password","input","reveal","scramble","eye"],
  pageTypes: ["auth"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Real password input underneath (autofill and managers work); toggle is aria-pressed with a label; character count announced. Reduced motion: instant swap.",
  perf: "Scramble runs ~350 ms only on toggle.",
  status: "stable",
  priority: "P1",
  previewHeight: 300,
  props: [
    { name: "label", type: "string", default: "'Password'", description: "Label." },
    { name: "name", type: "string", default: "'password'", description: "Field name." },
    { name: "autoComplete", type: "string", default: "'current-password'", description: "Autocomplete hint." },
  ],
};
