"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { haptic } from "../../_shared/phone";

const menu = [["Neon Ramen", "$14", 3], ["Aurora Bowl", "$12", 6], ["Dune Tacos", "$11", 1], ["Ocean Poke", "$16", 7]] as const;

export function FlowFoodOrder({ initialStep = 0 }: { initialStep?: number }) {
  const [count, setCount] = useState(initialStep >= 1 ? 2 : 0);
  const [flyers, setFlyers] = useState<{ id: number; x: number; y: number; img: number }[]>([]);
  const [bump, setBump] = useState(0);
  const bag = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const add = (e: React.MouseEvent, img: number) => {
    haptic("medium");
    const r = root.current!.getBoundingClientRect();
    const s = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = Date.now();
    setFlyers((f) => [...f, { id, x: (s.left - r.left) / (r.width / 320), y: (s.top - r.top) / (r.height / 660), img }]);
    setTimeout(() => (setFlyers((f) => f.filter((x) => x.id !== id)), setCount((c) => c + 1), setBump((b) => b + 1), haptic("light")), 650);
  };
  return (
    <div ref={root} className="relative h-full overflow-hidden bg-orange-50 text-zinc-900">
      <header className="flex items-center justify-between px-5 pt-14 pb-3"><div><p className="text-xs text-orange-600">Delivering to</p><p className="font-semibold">221B Baker St</p></div>
        <motion.div ref={bag} key={bump} animate={bump ? { scale: [1, 1.3, 1], rotate: [0, -12, 0] } : {}} transition={{ duration: 0.4 }} className="relative grid size-11 place-items-center rounded-full bg-zinc-900 text-white"><ShoppingBag className="size-5" />
          <AnimatePresence>{count > 0 && <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring.bouncy} className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-orange-500 text-[11px] font-bold">{count}</motion.span>}</AnimatePresence>
        </motion.div>
      </header>
      <div className="grid grid-cols-2 gap-3 px-4">
        {menu.map(([n, p, img]) => (
          <div key={n} className="overflow-hidden rounded-2xl bg-white shadow-sm"><img src={`/demo/photo-${img}.jpg`} alt="" className="aspect-square w-full object-cover" />
            <div className="flex items-center justify-between p-2.5"><div><p className="text-sm font-semibold">{n}</p><p className="text-xs text-zinc-500">{p}</p></div><motion.button whileTap={{ scale: 0.85 }} onClick={(e) => add(e, img)} aria-label={`Add ${n}`} className="grid size-8 place-items-center rounded-full bg-orange-500 text-lg font-bold text-white">+</motion.button></div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {flyers.map((f) => (
          <motion.img key={f.id} src={`/demo/photo-${f.img}.jpg`} alt="" className="pointer-events-none absolute size-10 rounded-full object-cover shadow-lg" initial={{ left: f.x, top: f.y, scale: 1, opacity: 1 }} animate={{ left: [f.x, f.x - 40, 262], top: [f.y, f.y - 120, 62], scale: [1, 1.4, 0.3], opacity: [1, 1, 0.6] }} transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], times: [0, 0.35, 1] }} />
        ))}
      </AnimatePresence>
      <AnimatePresence>{count > 0 && <motion.button initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={spring.smooth} className="absolute inset-x-4 bottom-6 flex h-14 items-center justify-between rounded-2xl bg-zinc-900 px-5 text-white"><span className="font-semibold">View bag</span><span className="text-sm text-white/70">{count} items</span></motion.button>}</AnimatePresence>
    </div>
  );
}
