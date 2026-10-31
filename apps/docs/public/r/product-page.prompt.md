You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Product Detail Page (`product-page`)

E-commerce PDP: crossfading gallery with thumbnails, like burst, star rating, sliding size selector and a stateful Add to bag.

## What it should do
Build a product detail page: left — main image crossfading/zooming between selected thumbnails, with a like-burst button overlay; right — title, rating, price that updates with size, a size radiogroup whose selection ring glides (layoutId), and an async stateful Add-to-bag button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/product-page.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/rating-stars.json https://marvzkineticlibrary.vercel.app/r/button-stateful.json https://marvzkineticlibrary.vercel.app/r/like-burst.json
```

## Non-negotiables
- **Accessibility:** Size options are a radiogroup; thumbnails labelled; async add-to-bag announces its result.
- **Performance:** One image transition at a time.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/product-page.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RatingStars } from "@/components/kinetik/rating-stars";
import { ButtonStateful } from "@/components/kinetik/button-stateful";
import { LikeBurst } from "@/components/kinetik/like-burst";

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
```

## Usage example
```tsx
"use client";
import { ProductPage } from "@/components/kinetik/product-page";
export default function Demo() { return <div className="h-full overflow-auto"><ProductPage /></div>; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
