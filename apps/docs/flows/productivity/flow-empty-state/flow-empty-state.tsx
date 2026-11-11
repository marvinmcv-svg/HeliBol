"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Plus, X } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { useReducedMotion } from "@kinetik/core";
import { haptic } from "../../_shared/phone";

type Task = { id: number; title: string; done: boolean };

/**
 * Empty state → first item → celebration. A friendly illustration bobs, the FAB pulses to point
 * the way, the compose sheet slides up, the new task drops into the list and the empty state
 * morphs away. Completing the first task fires a small confetti burst and a streak chip.
 */
export function FlowEmptyState({ initialStep = 0 }: { initialStep?: number }) {
  const reduced = useReducedMotion();
  const [tasks, setTasks] = useState<Task[]>(initialStep >= 2 ? [{ id: 1, title: "Plan the week", done: initialStep >= 3 }] : []);
  const [sheet, setSheet] = useState(initialStep === 1);
  const [draft, setDraft] = useState(initialStep === 1 ? "Plan the week" : "");
  const [celebrate, setCelebrate] = useState(initialStep >= 3);
  const t = reduced ? { duration: 0 } : spring.smooth;

  const add = () => {
    if (!draft.trim()) return;
    haptic("success");
    setTasks((ts) => [...ts, { id: Date.now(), title: draft.trim(), done: false }]);
    setDraft("");
    setSheet(false);
  };
  const toggle = (id: number) => {
    setTasks((ts) => ts.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
    const first = tasks.every((x) => !x.done);
    if (first) { haptic("success"); setCelebrate(true); }
  };

  return (
    <div className="relative flex h-full flex-col bg-white px-5 pt-14 text-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Today</h2>
        <AnimatePresence>
          {celebrate && (
            <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={reduced ? { duration: 0 } : spring.bouncy} className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              🔥 1-day streak
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-4 flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {tasks.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9, filter: reduced ? "none" : "blur(6px)" }} transition={t} className="flex h-full flex-col items-center justify-center pb-24 text-center">
              <motion.div animate={reduced ? undefined : { y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="relative grid size-28 place-items-center rounded-[2rem] bg-gradient-to-br from-violet-100 to-sky-100 text-5xl">
                ✨<span className="absolute -right-2 -top-2 text-2xl">☁️</span>
              </motion.div>
              <h3 className="mt-6 text-lg font-semibold">A clean slate</h3>
              <p className="mt-1 max-w-[14rem] text-sm text-zinc-500">Nothing on your plate yet. Add your first task and we&apos;ll keep it moving.</p>
            </motion.div>
          ) : (
            <motion.ul key="list" className="space-y-2">
              <AnimatePresence initial={false}>
                {tasks.map((x) => (
                  <motion.li key={x.id} layout initial={reduced ? { opacity: 0 } : { opacity: 0, y: -30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={reduced ? { duration: 0 } : spring.bouncy} className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3">
                    <button onClick={() => toggle(x.id)} aria-pressed={x.done} aria-label={x.done ? `Mark ${x.title} not done` : `Complete ${x.title}`} className={`grid size-6 place-items-center rounded-full border-2 transition-colors ${x.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-zinc-300"}`}>
                      <AnimatePresence>{x.done && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="size-3.5" strokeWidth={3} /></motion.span>}</AnimatePresence>
                    </button>
                    <span className={`text-sm transition-colors ${x.done ? "text-zinc-400 line-through" : ""}`}>{x.title}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </AnimatePresence>
        {celebrate && !reduced && (
          <div aria-hidden className="pointer-events-none absolute left-8 top-4">
            {Array.from({ length: 14 }, (_, i) => (
              <motion.span key={i} className="absolute size-2 rounded-sm" style={{ background: ["#a78bfa", "#f472b6", "#fbbf24", "#34d399"][i % 4] }} initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: Math.cos(i * 0.45) * (60 + (i % 3) * 30), y: Math.sin(i * 0.45) * 50 + 80, opacity: 0, rotate: 360 }} transition={{ duration: 1.1, ease: "easeOut" }} />
            ))}
          </div>
        )}
      </div>

      <motion.button
        onClick={() => (haptic(), setSheet(true))}
        aria-label="Add task"
        className="absolute bottom-8 right-5 grid size-14 place-items-center rounded-full bg-zinc-900 text-white shadow-xl"
        animate={tasks.length === 0 && !sheet && !reduced ? { boxShadow: ["0 0 0 0 rgb(139 92 246 / .5)", "0 0 0 16px rgb(139 92 246 / 0)"] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity }}
        whileTap={reduced ? undefined : { scale: 0.9 }}
      >
        <Plus className="size-6" />
      </motion.button>

      <AnimatePresence>
        {sheet && (
          <>
            <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} className="absolute inset-0 bg-black/30" />
            <motion.form
              key="sheet"
              onSubmit={(e) => (e.preventDefault(), add())}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={reduced ? { duration: 0 } : spring.smooth}
              className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 pb-8 shadow-2xl"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-200" />
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">New task</h3>
                <button type="button" onClick={() => setSheet(false)} aria-label="Close"><X className="size-5 text-zinc-400" /></button>
              </div>
              <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="What needs doing?" aria-label="Task title" className="mt-3 w-full rounded-xl bg-zinc-100 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400" />
              <button type="submit" disabled={!draft.trim()} className="mt-3 w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white disabled:opacity-40">Add task</button>
            </motion.form>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
