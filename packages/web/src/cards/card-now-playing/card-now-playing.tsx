"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface Track { title: string; artist: string; cover: string; duration: number }
export interface CardNowPlayingProps {
  track: Track;
  defaultExpanded?: boolean;
  className?: string;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Mini player → full player. The compact pill (cover, title, live equaliser) expands in place into a
 * full card — cover, title and controls are shared elements that fly to their new spots — with a
 * draggable scrubber and elapsed/remaining time. Collapse to tuck it back.
 */
export function CardNowPlaying({ track, defaultExpanded = false, className }: CardNowPlayingProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(defaultExpanded);
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(track.duration * 0.32);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => (x + 1) % track.duration), 1000);
    return () => clearInterval(id);
  }, [playing, track.duration]);
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 30 };
  const PlayBtn = ({ big }: { big?: boolean }) => (
    <motion.button layoutId="np-play" transition={spring} type="button" aria-label={playing ? "Pause" : "Play"} onClick={(e) => (e.stopPropagation(), setPlaying(!playing))} className={cn("grid place-items-center rounded-full bg-white text-black", big ? "size-14" : "size-8")}>
      {playing ? <Pause className={big ? "size-6" : "size-4"} fill="currentColor" /> : <Play className={cn(big ? "size-6" : "size-4", "translate-x-px")} fill="currentColor" />}
    </motion.button>
  );

  return (
    <div className={cn("relative grid w-80 place-items-center", className)}>
      <motion.div layout transition={spring} className={cn("overflow-hidden bg-zinc-900 text-white shadow-2xl", open ? "w-80 rounded-[32px] p-5" : "w-72 rounded-full p-2 pr-3")}>
        {open ? (
          <div className="space-y-3.5">
            <button type="button" onClick={() => setOpen(false)} aria-label="Collapse player" className="mx-auto -mt-2 flex text-white/60 hover:text-white"><ChevronDown className="size-5" /></button>
            <motion.img layoutId="np-cover" transition={spring} src={track.cover} alt="" className="aspect-[5/4] w-full rounded-2xl object-cover shadow-lg" />
            <motion.div layoutId="np-meta" transition={spring}>
              <p className="text-lg font-semibold">{track.title}</p>
              <p className="text-sm text-white/60">{track.artist}</p>
            </motion.div>
            <div>
              <input type="range" min={0} max={track.duration} value={t} onChange={(e) => setT(+e.target.value)} aria-label="Seek" className="h-1 w-full cursor-pointer accent-white" />
              <div className="mt-1 flex justify-between font-mono text-[11px] text-white/50"><span>{fmt(t)}</span><span>-{fmt(track.duration - t)}</span></div>
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 0.15 }} className="flex items-center justify-center gap-8">
              <button type="button" aria-label="Previous" onClick={() => setT(0)}><SkipBack className="size-6" fill="currentColor" /></button>
              <PlayBtn big />
              <button type="button" aria-label="Next" onClick={() => setT(0)}><SkipForward className="size-6" fill="currentColor" /></button>
            </motion.div>
          </div>
        ) : (
          <div role="button" tabIndex={0} aria-label={`Expand player: ${track.title}`} onClick={() => setOpen(true)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(true))} className="flex cursor-pointer items-center gap-3">
            <motion.img layoutId="np-cover" transition={spring} src={track.cover} alt="" className="size-11 rounded-full object-cover" />
            <motion.div layoutId="np-meta" transition={spring} className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{track.title}</p>
              <p className="truncate text-xs text-white/60">{track.artist}</p>
            </motion.div>
            <Eq playing={playing && !reduced} />
            <PlayBtn />
          </div>
        )}
      </motion.div>
      <AnimatePresence>{!open && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-xs text-muted-foreground">Tap the player to expand</motion.p>}</AnimatePresence>
    </div>
  );
}

function Eq({ playing }: { playing: boolean }) {
  return (
    <span aria-hidden className="flex h-4 items-end gap-[3px]">
      {[0.6, 1, 0.4, 0.8].map((h, i) => (
        <motion.span key={i} className="w-[3px] rounded-full bg-emerald-400" animate={playing ? { height: ["30%", `${h * 100}%`, "45%", "90%", "30%"] } : { height: "30%" }} transition={{ duration: 1.1 + i * 0.17, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </span>
  );
}
