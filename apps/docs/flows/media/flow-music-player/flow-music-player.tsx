"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { haptic } from "../../_shared/phone";

export function FlowMusicPlayer({ initialStep = 0 }: { initialStep?: number }) {
  const [open, setOpen] = useState(initialStep >= 1);
  const [playing, setPlaying] = useState(initialStep !== 2);
  return (
    <div className="relative h-full overflow-hidden bg-zinc-950 text-white">
      <div className="space-y-3 px-5 pt-14">
        <h2 className="text-2xl font-semibold">Library</h2>
        {[1, 3, 4, 5, 7].map((n, i) => <div key={n} className="flex items-center gap-3"><img src={`/demo/photo-${n}.jpg`} alt="" className="size-12 rounded-lg object-cover" /><div className="text-sm"><p className="font-medium">Track {i + 1}</p><p className="text-white/50">Kinetik Radio</p></div></div>)}
      </div>
      <AnimatePresence initial={false}>
        {!open ? (
          <motion.button key="mini" layoutId="mp-shell" onClick={() => (haptic(), setOpen(true))} transition={spring.smooth} className="absolute inset-x-2 bottom-6 flex items-center gap-3 rounded-2xl bg-zinc-800 p-2 text-left" style={{ borderRadius: 16 }}>
            <motion.img layoutId="mp-art" src="/demo/photo-6.jpg" alt="" className="size-11 rounded-lg object-cover" transition={spring.smooth} />
            <motion.div layoutId="mp-title" className="flex-1 text-sm"><p className="font-medium">Aurora Drive</p><p className="text-xs text-white/50">Northern Lights</p></motion.div>
            <span onClick={(e) => (e.stopPropagation(), setPlaying((p) => !p))} className="mr-2">{playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}</span>
          </motion.button>
        ) : (
          <motion.div key="full" layoutId="mp-shell" transition={spring.smooth} className="absolute inset-0 flex flex-col bg-gradient-to-b from-violet-900 to-zinc-950 px-6 pt-12 pb-10" style={{ borderRadius: 0 }}>
            <button onClick={() => (haptic(), setOpen(false))} aria-label="Minimize" className="mx-auto"><ChevronDown className="size-6" /></button>
            <motion.img layoutId="mp-art" src="/demo/photo-6.jpg" alt="" transition={spring.smooth} animate={{ scale: playing ? 1 : 0.86 }} className="mt-6 aspect-square w-full rounded-2xl object-cover shadow-2xl" />
            <motion.div layoutId="mp-title" className="mt-6"><p className="text-xl font-semibold">Aurora Drive</p><p className="text-white/60">Northern Lights</p></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} className="mt-auto">
              <div className="h-1 rounded-full bg-white/20"><div className="h-full w-2/5 rounded-full bg-white" /></div>
              <div className="mt-6 flex items-center justify-center gap-10"><SkipBack className="size-7 fill-current" /><motion.button whileTap={{ scale: 0.85 }} onClick={() => (haptic("medium"), setPlaying((p) => !p))} aria-label={playing ? "Pause" : "Play"} className="grid size-16 place-items-center rounded-full bg-white text-black">{playing ? <Pause className="size-7 fill-current" /> : <Play className="ml-1 size-7 fill-current" />}</motion.button><SkipForward className="size-7 fill-current" /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
