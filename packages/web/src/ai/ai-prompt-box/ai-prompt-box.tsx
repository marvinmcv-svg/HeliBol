"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface AiPromptBoxProps {
  onSubmit?: (prompt: string, files: string[]) => Promise<unknown> | void;
  placeholder?: string;
  models?: string[];
  className?: string;
}

/** Chat composer: auto-growing textarea, attachment chips, model picker, and a send button that morphs into Stop while generating. */
export function AiPromptBox({ onSubmit, placeholder = "Ask anything…", models = ["Opus", "Sonnet", "Haiku"], className }: AiPromptBoxProps) {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState(models[0]);
  const ta = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);
  const submit = async () => {
    if (busy) return setBusy(false);
    if (!value.trim()) return;
    setBusy(true);
    await (onSubmit?.(value, files) ?? new Promise((r) => setTimeout(r, 2500)));
    setBusy(false);
    setValue("");
    setFiles([]);
  };
  return (
    <motion.div layout transition={spring.smooth} className={cn("w-full max-w-xl rounded-3xl border border-border bg-card p-2 shadow-lg transition-shadow focus-within:shadow-xl focus-within:ring-2 focus-within:ring-ring/30", className)}>
      <AnimatePresence initial={false}>
        {files.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-wrap gap-1.5 overflow-hidden px-2 pt-1">
            <AnimatePresence>
              {files.map((f) => (
                <motion.span key={f} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs">
                  📄 {f}
                  <button onClick={() => setFiles((x) => x.filter((y) => y !== f))} aria-label={`Remove ${f}`} className="text-muted-foreground hover:text-foreground"><X className="size-3" /></button>
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <textarea
        ref={ta}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), submit())}
        placeholder={placeholder}
        aria-label="Prompt"
        className="block w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center gap-1.5 px-1">
        <button onClick={() => setFiles((f) => [...f, `brief-${f.length + 1}.pdf`])} aria-label="Attach file" className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"><Paperclip className="size-4" /></button>
        <select value={model} onChange={(e) => setModel(e.target.value)} aria-label="Model" className="h-8 rounded-full bg-muted px-2.5 text-xs outline-none">
          {models.map((m) => <option key={m}>{m}</option>)}
        </select>
        <motion.button
          onClick={submit}
          disabled={!busy && !value.trim()}
          aria-label={busy ? "Stop generating" : "Send"}
          whileTap={{ scale: 0.9 }}
          className="ml-auto grid size-9 place-items-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={busy ? "s" : "a"} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={spring.snappy}>
              {busy ? <Square className="size-3.5 fill-current" /> : <ArrowUp className="size-4" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
