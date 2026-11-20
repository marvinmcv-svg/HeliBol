"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Mic, Paperclip, X } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ChatMessage { id: number; text: string; me: boolean }
export interface FormChatComposerProps {
  initial?: ChatMessage[];
  placeholder?: string;
  onSend?: (text: string, files: string[]) => void;
  className?: string;
}

/**
 * Messaging composer with polish: the field grows with the text, attachments drop in as removable
 * chips, the mic button morphs into a send arrow as soon as you type, and on send the text lifts out
 * of the field and becomes a bubble in the thread above (shared layout), with a typing reply after.
 */
export function FormChatComposer({ initial = [], placeholder = "Message", onSend, className }: FormChatComposerProps) {
  const reduced = useReducedMotion();
  const [msgs, setMsgs] = useState<ChatMessage[]>(initial);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const id = useRef(1000);
  const ta = useRef<HTMLTextAreaElement>(null);
  const has = text.trim().length > 0 || files.length > 0;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 30 };

  const send = () => {
    if (!has) return;
    const n = ++id.current;
    setMsgs((m) => [...m, { id: n, text: text.trim() || `📎 ${files.join(", ")}`, me: true }]);
    onSend?.(text.trim(), files);
    setText("");
    setFiles([]);
    if (ta.current) ta.current.style.height = "";
    setTimeout(() => setTyping(true), 500);
    setTimeout(() => (setTyping(false), setMsgs((m) => [...m, { id: ++id.current, text: "Got it — on it 👍", me: false }])), 1900);
  };

  return (
    <div className={cn("flex h-[420px] w-[340px] flex-col overflow-hidden rounded-[28px] border bg-card shadow-xl", className)}>
      <div role="log" aria-live="polite" className="flex flex-1 flex-col justify-end gap-1.5 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.p
              key={m.id}
              layout
              initial={reduced ? { opacity: 0 } : m.me ? { opacity: 0, y: 40, scale: 0.9 } : { opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              transition={spring}
              style={{ originX: m.me ? 1 : 0, originY: 1 }}
              className={cn("max-w-[78%] rounded-2xl px-3.5 py-2 text-sm", m.me ? "self-end rounded-br-md bg-sky-500 text-white" : "self-start rounded-bl-md bg-muted")}
            >
              {m.text}
            </motion.p>
          ))}
          {typing && (
            <motion.div key="typing" layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex gap-1 self-start rounded-2xl rounded-bl-md bg-muted px-3.5 py-3" aria-label="Typing">
              {[0, 1, 2].map((i) => <motion.span key={i} className="size-1.5 rounded-full bg-muted-foreground" animate={reduced ? {} : { y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form onSubmit={(e) => (e.preventDefault(), send())} className="border-t p-3">
        <AnimatePresence initial={false}>
          {files.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap gap-1.5 pb-2">
                <AnimatePresence>
                  {files.map((f) => (
                    <motion.span key={f} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} className="inline-flex items-center gap-1 rounded-full bg-muted py-1 pl-2.5 pr-1 text-xs">
                      📎 {f}
                      <button type="button" aria-label={`Remove ${f}`} onClick={() => setFiles((x) => x.filter((y) => y !== f))} className="grid size-4 place-items-center rounded-full hover:bg-foreground/10"><X className="size-3" /></button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-end gap-2">
          <button type="button" aria-label="Attach a file" onClick={() => setFiles((x) => [...x, ["brief.pdf", "moodboard.png", "notes.md", "budget.xlsx"][x.length % 4]!].filter((v, i, a) => a.indexOf(v) === i))} className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted">
            <Paperclip className="size-4" />
          </button>
          <textarea
            ref={ta}
            rows={1}
            value={text}
            placeholder={placeholder}
            aria-label="Message"
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(120, e.target.scrollHeight)}px`;
            }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            className="max-h-[120px] min-h-9 flex-1 resize-none rounded-[18px] border bg-background px-3.5 py-2 text-sm leading-5 outline-none transition-[height] focus:ring-2 focus:ring-ring"
          />
          <motion.button type={has ? "submit" : "button"} aria-label={has ? "Send" : "Record voice message"} animate={{ backgroundColor: has ? "#0ea5e9" : "rgba(0,0,0,0)", color: has ? "#fff" : "currentColor" }} className="relative grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={has ? "send" : "mic"} initial={{ scale: 0, rotate: reduced ? 0 : -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: reduced ? 0 : 90 }} transition={spring}>
                {has ? <ArrowUp className="size-4" /> : <Mic className="size-4" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
