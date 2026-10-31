"use client";
import { useRef, useState, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface StoryStep {
  title: string;
  body: string;
  visual: ReactNode;
}

/** Apple/Stripe pinned story: text steps scroll by on the left while the sticky visual on the right swaps per active step. */
export function PinnedStory({ steps, container, className }: { steps: StoryStep[]; container?: RefObject<HTMLElement | null>; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)))));
  return (
    <div ref={ref} className={cn("relative grid grid-cols-2 gap-8 px-6", className)}>
      <div>
        {steps.map((s, i) => (
          <div key={s.title} className="flex h-[70cqh] items-center">
            <motion.div animate={{ opacity: active === i ? 1 : 0.25, x: active === i ? 0 : -6 }} transition={spring.smooth}>
              <p className="font-mono text-xs text-brand">0{i + 1}</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="sticky top-[15cqh] h-[70cqh]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={active} initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }} transition={spring.smooth} className="h-full overflow-hidden rounded-3xl">
              {steps[active].visual}
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-1/2 -right-4 flex -translate-y-1/2 flex-col gap-1.5" aria-hidden>
            {steps.map((_, i) => <motion.span key={i} className="w-1 rounded-full bg-foreground" animate={{ height: active === i ? 20 : 6, opacity: active === i ? 1 : 0.3 }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
