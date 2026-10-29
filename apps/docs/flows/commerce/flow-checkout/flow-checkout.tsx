"use client";
import { useRef, useState } from "react";
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { haptic } from "../../_shared/phone";

function SwipeToPay({ onDone, label }: { onDone: () => void; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const max = () => (track.current?.offsetWidth ?? 280) - 56;
  const fill = useTransform(x, (v) => v + 56);
  const textOpacity = useTransform(x, [0, 120], [1, 0]);
  return (
    <div ref={track} className="relative h-14 overflow-hidden rounded-full bg-zinc-900 text-white">
      <motion.div className="absolute inset-y-0 left-0 rounded-full bg-emerald-500" style={{ width: fill }} />
      <motion.span style={{ opacity: textOpacity }} className="absolute inset-0 grid place-items-center text-sm font-semibold">{label}</motion.span>
      <motion.button
        aria-label={label}
        onClick={() => { haptic("success"); onDone(); }}
        drag="x"
        dragConstraints={track}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={() => {
          if (x.get() > max() * 0.85) {
            animate(x, max(), spring.snappy);
            haptic("success");
            setTimeout(onDone, 250);
          } else animate(x, 0, spring.bouncy);
        }}
        className="absolute top-1 left-1 z-10 grid size-12 cursor-grab place-items-center rounded-full bg-white text-zinc-900 active:cursor-grabbing"
      >
        <ChevronRight className="size-5" />
      </motion.button>
    </div>
  );
}

export function FlowCheckout({ initialStep = 0 }: { initialStep?: number }) {
  const [qty, setQty] = useState(1);
  const [paid, setPaid] = useState(initialStep === 2);
  const total = 64 * qty + 8;
  return (
    <div className="flex h-full flex-col bg-zinc-50 px-5 pt-14 pb-8 text-zinc-900">
      <AnimatePresence mode="wait">
        {paid ? (
          <motion.div key="ok" className="flex flex-1 flex-col items-center justify-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="grid size-24 place-items-center rounded-full bg-emerald-500 text-4xl text-white" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={spring.bouncy}>✓</motion.div>
            <h2 className="mt-5 text-2xl font-semibold">Paid ${total}</h2>
            <p className="text-sm text-zinc-500">Arriving Tuesday · Order #2048</p>
            <button onClick={() => setPaid(false)} className="mt-6 text-xs text-zinc-400">Restart demo</button>
          </motion.div>
        ) : (
          <motion.div key="cart" className="flex flex-1 flex-col" exit={{ opacity: 0, y: -20 }}>
            <h2 className="text-2xl font-semibold tracking-tight">Your bag</h2>
            <motion.div layout className="mt-5 flex gap-3 rounded-3xl bg-white p-3 shadow-sm">
              <img src="/demo/photo-6.jpg" alt="" className="size-24 rounded-2xl object-cover" />
              <div className="flex flex-1 flex-col">
                <p className="font-semibold">Aurora Print</p>
                <p className="text-xs text-zinc-500">A3 · Matte</p>
                <div className="mt-auto flex items-center justify-between">
                  <p className="font-semibold tabular-nums">${64 * qty}</p>
                  <div className="flex items-center gap-2 rounded-full bg-zinc-100 p-1">
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => { setQty((q) => Math.max(1, q - 1)); haptic(); }} aria-label="Decrease" className="grid size-7 place-items-center rounded-full bg-white"><Minus className="size-3.5" /></motion.button>
                    <span className="relative w-4 overflow-hidden text-center text-sm font-semibold tabular-nums">
                      <AnimatePresence mode="popLayout" initial={false}><motion.span key={qty} className="block" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={spring.snappy}>{qty}</motion.span></AnimatePresence>
                    </span>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => { setQty((q) => Math.min(9, q + 1)); haptic(); }} aria-label="Increase" className="grid size-7 place-items-center rounded-full bg-white"><Plus className="size-3.5" /></motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500"><dt>Subtotal</dt><dd className="tabular-nums">${64 * qty}</dd></div>
              <div className="flex justify-between text-zinc-500"><dt>Shipping</dt><dd>$8</dd></div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">${total}</dd></div>
            </dl>
            <div className="mt-auto"><SwipeToPay label={`Swipe to pay $${total}`} onDone={() => setPaid(true)} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
