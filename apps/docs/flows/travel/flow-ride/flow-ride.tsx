"use client";
import { useState } from "react";
import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import { spring } from "@kinetik/tokens";
import { haptic } from "../../_shared/phone";

const rides = [["Economy", "$12.40", "3 min", "🚗"], ["Comfort", "$18.90", "5 min", "🚙"], ["XL", "$24.10", "7 min", "🚐"]];
const SNAPS = [80, 300, 520];

export function FlowRide({ initialStep = 0 }: { initialStep?: number }) {
  const y = useMotionValue(SNAPS[initialStep === 0 ? 1 : initialStep === 1 ? 0 : 1]);
  const [sel, setSel] = useState(1);
  const [booked, setBooked] = useState(initialStep === 2);
  const end = (_: unknown, i: PanInfo) => {
    const target = y.get() + i.velocity.y * 0.2;
    const snap = SNAPS.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a));
    animate(y, snap, spring.smooth);
    haptic();
  };
  return (
    <div className="relative h-full overflow-hidden bg-[#e8eef3]">
      <svg viewBox="0 0 320 660" className="absolute inset-0 h-full w-full" aria-hidden>
        {[60, 140, 230, 330, 450].map((v) => <path key={v} d={`M0 ${v} Q160 ${v + 40} 320 ${v - 20}`} stroke="#fff" strokeWidth="10" fill="none" />)}
        {[50, 150, 250].map((v) => <path key={v} d={`M${v} 0 L${v + 30} 660`} stroke="#fff" strokeWidth="8" fill="none" />)}
        <motion.path d="M70 420 C110 340 190 330 210 230 S240 120 250 90" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }} />
        <circle cx="70" cy="420" r="7" fill="#111" /><rect x="243" y="83" width="14" height="14" fill="#111" />
        <motion.text x="0" y="0" fontSize="18" animate={{ offsetDistance: ["0%", "100%"] } as never} style={{ offsetPath: 'path("M70 420 C110 340 190 330 210 230 S240 120 250 90")' } as React.CSSProperties} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>🚗</motion.text>
      </svg>
      <motion.div drag="y" dragConstraints={{ top: SNAPS[0], bottom: SNAPS[2] }} dragElastic={0.1} onDragEnd={end} style={{ y }} className="absolute inset-x-0 top-0 h-[600px] cursor-grab touch-none rounded-t-3xl bg-white p-4 shadow-[0_-10px_30px_rgb(0_0_0/.12)] active:cursor-grabbing">
        <span className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-zinc-300" />
        {booked ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-zinc-900"><p className="text-4xl">🚙</p><p className="mt-2 text-lg font-semibold">Driver on the way</p><p className="text-sm text-zinc-500">Maya · Grey Tesla · 4 min</p><button onClick={() => setBooked(false)} className="mt-4 text-xs text-zinc-400">Restart demo</button></motion.div>
        ) : (
          <div className="text-zinc-900">
            <p className="mb-3 font-semibold">Choose a ride</p>
            <div className="space-y-2" role="radiogroup">
              {rides.map(([n, p, eta, e], i) => (
                <button key={n} role="radio" aria-checked={sel === i} onClick={() => (haptic(), setSel(i))} className="relative flex w-full items-center gap-3 rounded-2xl p-3 text-left">
                  {sel === i && <motion.span layoutId="ride-sel" className="absolute inset-0 rounded-2xl border-2 border-zinc-900" transition={spring.snappy} />}
                  <span className="relative text-3xl">{e}</span><span className="relative flex-1"><span className="block font-medium">{n}</span><span className="text-xs text-zinc-500">{eta} away</span></span><span className="relative font-semibold">{p}</span>
                </button>
              ))}
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => (haptic("success"), setBooked(true))} className="mt-4 h-12 w-full rounded-2xl bg-zinc-900 font-semibold text-white">Confirm {rides[sel][0]}</motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
