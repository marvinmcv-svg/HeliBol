"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { Heart, X } from "lucide-react";
import { cn } from "@kinetik/core";

export interface SwipeCard {
  id: string;
  content: ReactNode;
}

function TopCard({ card, onSwipe }: { card: SwipeCard; onSwipe: (dir: 1 | -1) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const like = useTransform(x, [20, 120], [0, 1]);
  const nope = useTransform(x, [-120, -20], [1, 0]);
  const end = (_: unknown, i: PanInfo) => {
    if (Math.abs(i.offset.x) > 110 || Math.abs(i.velocity.x) > 600) onSwipe(i.offset.x > 0 ? 1 : -1);
  };
  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={end}
      exit={{ x: x.get() >= 0 ? 400 : -400, opacity: 0, rotate: x.get() >= 0 ? 25 : -25, transition: { duration: 0.35 } }}
    >
      {card.content}
      <motion.span style={{ opacity: like }} className="absolute top-5 left-5 rotate-[-14deg] rounded-lg border-4 border-emerald-400 px-2 text-2xl font-black text-emerald-400">LIKE</motion.span>
      <motion.span style={{ opacity: nope }} className="absolute top-5 right-5 rotate-[14deg] rounded-lg border-4 border-rose-500 px-2 text-2xl font-black text-rose-500">NOPE</motion.span>
    </motion.div>
  );
}

/** Tinder-style deck: drag to swipe with rotation and LIKE/NOPE stamps, or use the buttons/arrow keys. */
export function CardSwipeDeck({ cards, onSwipe, className }: { cards: SwipeCard[]; onSwipe?: (id: string, dir: 1 | -1) => void; className?: string }) {
  const [stack, setStack] = useState(cards);
  const [, setLast] = useState<1 | -1>(1);
  const swipe = (dir: 1 | -1) => {
    const top = stack[0];
    if (!top) return;
    setLast(dir);
    onSwipe?.(top.id, dir);
    setStack((s) => s.slice(1));
  };
  return (
    <div className={cn("flex flex-col items-center gap-5", className)} onKeyDown={(e) => (e.key === "ArrowRight" ? swipe(1) : e.key === "ArrowLeft" ? swipe(-1) : null)}>
      <div className="relative h-80 w-60" aria-live="polite">
        {stack.slice(1, 3).map((c, i) => (
          <motion.div key={c.id} className="absolute inset-0" initial={false} animate={{ scale: 1 - (i + 1) * 0.05, y: (i + 1) * 12, opacity: 1 - (i + 1) * 0.25 }} style={{ zIndex: 2 - i }}>
            {c.content}
          </motion.div>
        )).reverse()}
        <AnimatePresence>{stack[0] && <TopCard key={stack[0].id} card={stack[0]} onSwipe={swipe} />}</AnimatePresence>
        {!stack.length && (
          <button onClick={() => setStack(cards)} className="absolute inset-0 grid place-items-center rounded-3xl border-2 border-dashed border-border text-sm text-muted-foreground">
            That&apos;s everyone — restart
          </button>
        )}
      </div>
      <div className="flex gap-4">
        <button onClick={() => swipe(-1)} aria-label="Nope" className="grid size-14 place-items-center rounded-full border border-border bg-card text-rose-500 shadow-sm transition-transform active:scale-90"><X className="size-6" /></button>
        <button onClick={() => swipe(1)} aria-label="Like" className="grid size-14 place-items-center rounded-full border border-border bg-card text-emerald-500 shadow-sm transition-transform active:scale-90"><Heart className="size-6" /></button>
      </div>
    </div>
  );
}
