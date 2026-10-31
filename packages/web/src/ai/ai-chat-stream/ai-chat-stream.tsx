"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface ChatMsg {
  role: "user" | "assistant";
  text: string;
}

function TypingDots() {
  return (
    <span className="flex gap-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => <motion.span key={i} className="size-1.5 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />)}
    </span>
  );
}

/** Chat thread where messages spring in and assistant replies stream word-by-word after a typing indicator. */
export function AiChatStream({ script, className }: { script: ChatMsg[]; className?: string }) {
  const [shown, setShown] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [partial, setPartial] = useState("");
  const reduced = useReducedMotion();
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      for (const m of script) {
        if (cancelled) return;
        if (m.role === "user") {
          await wait(500);
          setShown((s) => [...s, m]);
          continue;
        }
        setTyping(true);
        await wait(900);
        setTyping(false);
        const words = m.text.split(" ");
        for (let w = 1; w <= words.length && !reduced; w++) {
          if (cancelled) return;
          setPartial(words.slice(0, w).join(" "));
          await wait(45);
        }
        setPartial("");
        setShown((s) => [...s, m]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [script, reduced]);

  useEffect(() => end.current?.scrollIntoView({ block: "nearest" }), [shown, partial, typing]);
  const bubble = (m: ChatMsg) => cn("max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed", m.role === "user" ? "ml-auto rounded-br-md bg-foreground text-background" : "rounded-bl-md bg-muted");
  return (
    <div className={cn("flex flex-col gap-2 overflow-y-auto p-4", className)} role="log" aria-live="polite">
      <AnimatePresence initial={false}>
        {shown.map((m, i) => (
          <motion.div key={i} layout initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring.smooth} className={bubble(m)}>{m.text}</motion.div>
        ))}
        {typing && <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={bubble({ role: "assistant", text: "" })}><TypingDots /></motion.div>}
        {partial && <motion.div key="partial" className={bubble({ role: "assistant", text: "" })}>{partial}<span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-foreground" /></motion.div>}
      </AnimatePresence>
      <div ref={end} />
    </div>
  );
}
