"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ChevronLeft } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { haptic } from "../../_shared/phone";

type M = { id: number; me: boolean; text: string; react?: string };
const replies = ["haha yes 😂", "on my way!", "send me the link", "that spring feels perfect"];

export function FlowChat({ initialStep = 0 }: { initialStep?: number }) {
  const [msgs, setMsgs] = useState<M[]>([{ id: 1, me: false, text: "did you ship the paywall?" }, { id: 2, me: true, text: "just now 🚀" }, ...(initialStep >= 1 ? [{ id: 3, me: false, text: "it looks amazing", react: initialStep >= 2 ? "❤️" : undefined }] : [])]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ block: "end" }), [msgs, typing]);
  const send = () => {
    if (!text.trim()) return;
    haptic("light");
    setMsgs((m) => [...m, { id: Date.now(), me: true, text }]);
    setText("");
    setTimeout(() => setTyping(true), 500);
    setTimeout(() => (setTyping(false), setMsgs((m) => [...m, { id: Date.now(), me: false, text: replies[m.length % replies.length] }]), haptic("light")), 1800);
  };
  const react = (id: number) => (haptic("medium"), setMsgs((m) => m.map((x) => (x.id === id ? { ...x, react: x.react ? undefined : "❤️" } : x))));
  return (
    <div className="flex h-full flex-col bg-white text-zinc-900">
      <header className="flex items-center gap-2 border-b border-zinc-100 px-3 pt-12 pb-2"><ChevronLeft className="size-5 text-sky-500" /><img src="/demo/photo-8.jpg" alt="" className="size-8 rounded-full object-cover" /><div className="text-sm"><p className="font-semibold">Ava</p><p className="text-[11px] text-zinc-400">{typing ? "typing…" : "online"}</p></div></header>
      <div className="flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div key={m.id} layout initial={{ opacity: 0, y: 14, scale: 0.9, originX: m.me ? 1 : 0 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring.smooth} className={`flex ${m.me ? "justify-end" : ""}`}>
              <button onDoubleClick={() => react(m.id)} className={`relative max-w-[75%] rounded-2xl px-3 py-1.5 text-left text-[14px] ${m.me ? "rounded-br-sm bg-sky-500 text-white" : "rounded-bl-sm bg-zinc-100"}`}>
                {m.text}
                <AnimatePresence>{m.react && <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={spring.bouncy} className={`absolute -bottom-3 ${m.me ? "left-0" : "right-0"} rounded-full bg-white px-1 text-xs shadow`}>{m.react}</motion.span>}</AnimatePresence>
              </button>
            </motion.div>
          ))}
          {typing && <motion.div key="t" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex w-14 gap-1 rounded-2xl bg-zinc-100 px-3 py-2.5">{[0, 1, 2].map((i) => <motion.span key={i} className="size-1.5 rounded-full bg-zinc-400" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />)}</motion.div>}
        </AnimatePresence>
        <div ref={end} />
      </div>
      <p className="pb-1 text-center text-[10px] text-zinc-400">Double-tap a bubble to ❤️</p>
      <form onSubmit={(e) => (e.preventDefault(), send())} className="flex items-center gap-2 border-t border-zinc-100 p-2 pb-6">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" aria-label="Message" className="h-9 flex-1 rounded-full border border-zinc-200 px-3 text-sm outline-none" />
        <motion.button whileTap={{ scale: 0.85 }} animate={{ scale: text ? 1 : 0.7, opacity: text ? 1 : 0.4 }} aria-label="Send" className="grid size-9 place-items-center rounded-full bg-sky-500 text-white"><ArrowUp className="size-4" /></motion.button>
      </form>
    </div>
  );
}
