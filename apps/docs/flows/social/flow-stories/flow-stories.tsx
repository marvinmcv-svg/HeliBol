"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { haptic } from "../../_shared/phone";

const stories = [3, 6, 1, 7];

export function FlowStories({ initialStep = 0 }: { initialStep?: number }) {
  const [i, setI] = useState(initialStep);
  const [paused, setPaused] = useState(false);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => (setI((n) => (n + 1) % stories.length), setK((x) => x + 1)), 4000);
    return () => clearTimeout(t);
  }, [i, paused, k]);
  const go = (d: number) => (haptic(), setI((n) => Math.max(0, Math.min(stories.length - 1, n + d))), setK((x) => x + 1));
  return (
    <div className="relative h-full overflow-hidden bg-black text-white" onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)}>
      <AnimatePresence initial={false}>
        <motion.img key={i} src={`/demo/photo-${stories[i]}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: paused ? 1.02 : 1.12 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.3 }, scale: { duration: 4, ease: "linear" } }} />
      </AnimatePresence>
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent px-3 pt-12 pb-8">
        <div className="flex gap-1">{stories.map((_, n) => <div key={n} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"><motion.div key={`${k}-${n}`} className="h-full bg-white" initial={{ width: n < i ? "100%" : "0%" }} animate={{ width: n < i ? "100%" : n === i ? (paused ? undefined : "100%") : "0%" }} transition={{ duration: n === i ? 4 : 0, ease: "linear" }} /></div>)}</div>
        <div className="mt-3 flex items-center gap-2 text-sm"><img src="/demo/photo-8.jpg" alt="" className="size-8 rounded-full border-2 border-white object-cover" /><span className="font-semibold">avamotion</span><span className="text-white/60">2h</span><X className="ml-auto size-5" /></div>
      </div>
      <button aria-label="Previous story" onClick={() => go(-1)} className="absolute inset-y-0 left-0 w-1/3" />
      <button aria-label="Next story" onClick={() => go(1)} className="absolute inset-y-0 right-0 w-2/3" />
      <AnimatePresence>{paused && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-x-0 bottom-24 text-center text-xs text-white/70">Paused</motion.p>}</AnimatePresence>
      <div className="absolute inset-x-3 bottom-8 flex items-center gap-2"><div className="h-10 flex-1 rounded-full border border-white/50 px-4 text-sm leading-10 text-white/70">Send message</div><span className="text-2xl">❤️</span></div>
    </div>
  );
}
