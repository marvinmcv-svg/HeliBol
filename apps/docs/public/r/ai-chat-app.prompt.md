You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# AI Chat App (`ai-chat-app`)

Full AI assistant screen: empty state with suggestion chips → reasoning trace → streaming reply, with a prompt composer pinned below.

## What it should do
Build an AI assistant screen: header with status pill; main area shows an empty state (headline + suggestion chips) that, on pick or submit, crossfades into a thread: user bubble, a 'thinking' trace, then a streamed assistant reply; composer pinned at the bottom.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/ai-chat-app.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/ai-prompt-box.json https://marvzkineticlibrary.vercel.app/r/ai-suggestions.json https://marvzkineticlibrary.vercel.app/r/ai-thinking.json https://marvzkineticlibrary.vercel.app/r/ai-chat-stream.json
```

## Non-negotiables
- **Accessibility:** Log region for messages, labelled composer, disclosure for reasoning.
- **Performance:** Only the active message streams.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/ai-chat-app.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AiPromptBox } from "@/components/kinetik/ai-prompt-box";
import { AiSuggestions } from "@/components/kinetik/ai-suggestions";
import { AiThinking } from "@/components/kinetik/ai-thinking";
import { AiChatStream } from "@/components/kinetik/ai-chat-stream";

/** AI app shell: empty state with suggestions → thinking trace → streaming reply, all in one canvas. */
export function AiChatApp() {
  const [q, setQ] = useState<string | null>(null);
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm"><span className="grid size-6 place-items-center rounded-md bg-foreground text-xs text-background">k</span><span className="font-medium">Kinetik Assistant</span><span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">online</span></header>
      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!q ? (
            <motion.div key="empty" exit={{ opacity: 0, y: -10 }} className="flex h-full flex-col items-center justify-center gap-5 p-6 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">How can I help you animate today?</h2>
              <AiSuggestions onPick={setQ} className="max-w-lg" items={[{ icon: "🎛️", label: "Tune my tab indicator spring" }, { icon: "📱", label: "Port my paywall to Expo" }, { icon: "♿", label: "Audit reduced motion" }]} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col gap-3 overflow-y-auto p-4">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-sm text-background">{q}</div>
              <AiThinking stepMs={700} steps={["Reading your component…", "Comparing spring presets…", "Writing the answer…"]} />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 2.4 } }}>
                <AiChatStream className="p-0" script={[{ role: "assistant", text: "Use the snappy preset — stiffness 500, damping 35. It settles in ~180ms with no overshoot, which is what an indicator should feel like. On native, pass the same numbers to withSpring." }]} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <div className="border-t border-border p-3"><AiPromptBox className="mx-auto shadow-none" onSubmit={async (p) => setQ(p)} /></div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { AiChatApp } from "@/components/kinetik/ai-chat-app";
export default function Demo() { return <AiChatApp />; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
