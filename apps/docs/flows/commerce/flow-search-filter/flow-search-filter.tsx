"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { useReducedMotion } from "@kinetik/core";
import { haptic } from "../../_shared/phone";

const products = [
  { id: 1, name: "Trail Runner", cat: "Shoes", price: 129, img: 1 },
  { id: 2, name: "Shell Jacket", cat: "Jackets", price: 189, img: 2 },
  { id: 3, name: "Merino Tee", cat: "Tops", price: 59, img: 3 },
  { id: 4, name: "Road Racer", cat: "Shoes", price: 159, img: 4 },
  { id: 5, name: "Puffer Vest", cat: "Jackets", price: 119, img: 5 },
  { id: 6, name: "Tech Hoodie", cat: "Tops", price: 89, img: 6 },
];
const cats = ["Shoes", "Jackets", "Tops"];

/**
 * Search → filter sheet → results. The search bar expands over the title, recent searches stagger
 * in, the filter sheet springs up with chips and a price cap, and the grid re-flows with layout
 * animations while the result count rolls. An empty result gets a helpful reset.
 */
export function FlowSearchFilter({ initialStep = 0 }: { initialStep?: number }) {
  const reduced = useReducedMotion();
  const [focused, setFocused] = useState(initialStep === 1);
  const [query, setQuery] = useState("");
  const [sheet, setSheet] = useState(initialStep === 2);
  const [picked, setPicked] = useState<string[]>(initialStep >= 3 ? ["Shoes"] : []);
  const [cap, setCap] = useState(200);
  const t = reduced ? { duration: 0 } : spring.smooth;

  const results = useMemo(() => products.filter((p) => (!query || p.name.toLowerCase().includes(query.toLowerCase())) && (!picked.length || picked.includes(p.cat)) && p.price <= cap), [query, picked, cap]);
  const active = picked.length + (cap < 200 ? 1 : 0);

  return (
    <div className="relative flex h-full flex-col bg-zinc-50 pt-12 text-zinc-900">
      <LayoutGroup>
        <div className="px-4">
          <AnimatePresence initial={false}>
            {!focused && <motion.h2 key="t" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={t} className="overflow-hidden text-2xl font-bold">Shop</motion.h2>}
          </AnimatePresence>
          <motion.div layout transition={t} className="mt-2 flex items-center gap-2">
            <label className="flex flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-zinc-200 focus-within:ring-2 focus-within:ring-zinc-900">
              <Search className="size-4 text-zinc-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} placeholder="Search products" aria-label="Search products" className="w-full bg-transparent text-sm outline-none" />
            </label>
            {focused ? (
              <button onClick={() => (setFocused(false), setQuery(""))} className="text-sm font-medium">Cancel</button>
            ) : (
              <button onClick={() => (haptic(), setSheet(true))} aria-label={`Filters${active ? `, ${active} active` : ""}`} className="relative grid size-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
                <SlidersHorizontal className="size-4" />
                <AnimatePresence>{active > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring.bouncy} className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-zinc-900 text-[10px] text-white">{active}</motion.span>}</AnimatePresence>
              </button>
            )}
          </motion.div>
        </div>

        {focused && !query ? (
          <motion.ul initial="h" animate="s" variants={{ s: { transition: { staggerChildren: reduced ? 0 : 0.05 } } }} className="mt-4 space-y-1 px-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Recent</p>
            {["running shoes", "rain jacket", "merino"].map((r) => (
              <motion.li key={r} variants={{ h: { opacity: 0, x: reduced ? 0 : -10 }, s: { opacity: 1, x: 0 } }}>
                <button onClick={() => setQuery(r.split(" ")[0])} className="w-full rounded-lg py-2 text-left text-sm">{r}</button>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="mt-4 flex-1 overflow-y-auto px-4 pb-6">
            <p className="mb-2 text-xs text-zinc-500" aria-live="polite">{results.length} result{results.length === 1 ? "" : "s"}</p>
            {results.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10 text-center">
                <p className="text-3xl">🔍</p>
                <p className="mt-2 text-sm font-medium">No matches</p>
                <button onClick={() => (setPicked([]), setCap(200), setQuery(""))} className="mt-3 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white">Clear filters</button>
              </motion.div>
            ) : (
              <ul className="grid grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                  {results.map((p) => (
                    <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={t} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                      <img src={`/demo/photo-${p.img}.jpg`} alt="" className="aspect-square w-full object-cover" />
                      <div className="p-2.5 text-xs"><p className="font-semibold">{p.name}</p><p className="text-zinc-500">${p.price}</p></div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        )}
      </LayoutGroup>

      <AnimatePresence>
        {sheet && (
          <>
            <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} className="absolute inset-0 bg-black/30" />
            <motion.div key="sheet" role="dialog" aria-label="Filters" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={reduced ? { duration: 0 } : spring.smooth} className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 pb-8 shadow-2xl">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-200" />
              <div className="flex items-center justify-between"><h3 className="font-semibold">Filters</h3><button onClick={() => setSheet(false)} aria-label="Close filters"><X className="size-5 text-zinc-400" /></button></div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-zinc-400">Category</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {cats.map((c) => {
                  const on = picked.includes(c);
                  return (
                    <motion.button key={c} whileTap={reduced ? undefined : { scale: 0.92 }} aria-pressed={on} onClick={() => (haptic(), setPicked((p) => (on ? p.filter((x) => x !== c) : [...p, c])))} className={`rounded-full px-3.5 py-1.5 text-sm ring-1 transition-colors ${on ? "bg-zinc-900 text-white ring-zinc-900" : "ring-zinc-200"}`}>
                      {c}
                    </motion.button>
                  );
                })}
              </div>
              <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Max price · <span className="text-zinc-900">${cap}</span></label>
              <input type="range" min={50} max={200} step={10} value={cap} onChange={(e) => setCap(Number(e.target.value))} aria-label="Maximum price" className="mt-2 w-full accent-zinc-900" />
              <button onClick={() => (haptic("medium"), setSheet(false))} className="mt-5 w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white">Show {results.length} results</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
