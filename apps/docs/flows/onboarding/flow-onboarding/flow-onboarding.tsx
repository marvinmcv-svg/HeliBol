"use client";
import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { spring } from "@kinetik/tokens";
import { haptic } from "../../_shared/phone";

const pages = [
  { title: "Motion that means something", body: "Every animation explains a change — never decoration for its own sake.", img: "/demo/photo-6.jpg", tint: "from-violet-600/0 via-violet-950/60 to-violet-950" },
  { title: "Same springs, every platform", body: "Web and native share one token system, so your brand feels identical.", img: "/demo/photo-2.jpg", tint: "from-indigo-600/0 via-indigo-950/60 to-indigo-950" },
  { title: "Accessible by default", body: "Reduced motion is designed, not bolted on. Everyone gets a great experience.", img: "/demo/photo-4.jpg", tint: "from-emerald-600/0 via-emerald-950/60 to-emerald-950" },
];

export function FlowOnboarding({ initialStep = 0 }: { initialStep?: number }) {
  const [[i, dir], set] = useState<[number, number]>([initialStep, 1]);
  const go = (n: number) => {
    if (n < 0 || n >= pages.length) return;
    haptic("light");
    set([n, n > i ? 1 : -1]);
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(i + 1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(i - 1);
  };
  const p = pages[i];
  return (
    <div className="relative h-full overflow-hidden bg-black text-white">
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={i}
          custom={dir}
          className="absolute inset-0"
          variants={{ enter: (d: number) => ({ x: `${d * 100}%` }), center: { x: 0 }, exit: (d: number) => ({ x: `${d * -35}%`, opacity: 0.4 }) }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={spring.smooth}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={onDragEnd}
        >
          {/* parallax: image moves slower than the page */}
          <motion.img src={p.img} alt="" draggable={false} className="absolute inset-0 h-[70%] w-full object-cover" initial={{ scale: 1.25, x: dir * 40 }} animate={{ scale: 1.05, x: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
          <div className={`absolute inset-0 bg-gradient-to-b ${p.tint}`} />
          <div className="absolute inset-x-0 bottom-36 px-7">
            <motion.h2 className="text-[28px] leading-tight font-semibold tracking-tight" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12, ...spring.gentle }}>{p.title}</motion.h2>
            <motion.p className="mt-3 text-[15px] text-white/70" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, ...spring.gentle }}>{p.body}</motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-10 flex items-center justify-between px-7">
        <div className="flex gap-1.5" role="tablist" aria-label="Onboarding pages">
          {pages.map((_, n) => (
            <motion.button key={n} role="tab" aria-selected={n === i} aria-label={`Page ${n + 1}`} onClick={() => go(n)} className="h-2 rounded-full bg-white" animate={{ width: n === i ? 24 : 8, opacity: n === i ? 1 : 0.35 }} transition={spring.snappy} />
          ))}
        </div>
        <motion.button layout onClick={() => (i === pages.length - 1 ? haptic("success") : go(i + 1))} whileTap={{ scale: 0.94 }} transition={spring.smooth} className="h-12 overflow-hidden rounded-full bg-white px-5 text-sm font-semibold text-black">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={i === pages.length - 1 ? "go" : "next"} className="block" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
              {i === pages.length - 1 ? "Get started" : "Next →"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
