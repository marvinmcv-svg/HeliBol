"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RatingStars } from "@web/buttons/rating-stars/rating-stars";
import { ButtonStateful } from "@web/buttons/button-stateful/button-stateful";
import { LikeBurst } from "@web/buttons/like-burst/like-burst";

const imgs = [6, 2, 3, 7];
const sizes = ["A4", "A3", "A2"];

export function ProductPage() {
  const [i, setI] = useState(0);
  const [size, setSize] = useState("A3");
  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-6 py-10 md:grid-cols-2">
      <div className="space-y-3">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img key={i} src={`/demo/photo-${imgs[i]}.jpg`} alt="Aurora print" className="absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
          </AnimatePresence>
          <div className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur"><LikeBurst /></div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {imgs.map((n, k) => <button key={n} onClick={() => setI(k)} aria-label={`View image ${k + 1}`} aria-pressed={i === k} className={`overflow-hidden rounded-xl ring-2 transition ${i === k ? "ring-foreground" : "ring-transparent opacity-60 hover:opacity-100"}`}><img src={`/demo/photo-${n}.jpg`} alt="" className="aspect-square w-full object-cover" /></button>)}
        </div>
      </div>
      <div className="space-y-5">
        <div><p className="text-sm text-muted-foreground">Limited edition print</p><h1 className="text-3xl font-semibold tracking-tight">Violet Aurora</h1><div className="mt-2 flex items-center gap-2"><RatingStars defaultValue={5} className="[&_svg]:size-5" /><span className="text-sm text-muted-foreground">(312)</span></div></div>
        <p className="text-3xl font-semibold">${{ A4: 48, A3: 64, A2: 92 }[size]}</p>
        <div>
          <p className="mb-2 text-sm font-medium">Size</p>
          <div className="flex gap-2" role="radiogroup">{sizes.map((s) => <button key={s} role="radio" aria-checked={size === s} onClick={() => setSize(s)} className="relative rounded-xl border border-border px-4 py-2 text-sm">{size === s && <motion.span layoutId="pp-size" className="absolute inset-0 rounded-xl border-2 border-foreground" transition={{ type: "spring", stiffness: 500, damping: 35 }} />}{s}</button>)}</div>
        </div>
        <ButtonStateful className="h-12 w-full" successLabel="Added to bag" onAction={() => new Promise((r) => setTimeout(r, 900))}>Add to bag</ButtonStateful>
        <p className="text-sm text-muted-foreground">Giclée print on 310gsm cotton rag. Ships in 3–5 days. Free returns.</p>
      </div>
    </section>
  );
}
