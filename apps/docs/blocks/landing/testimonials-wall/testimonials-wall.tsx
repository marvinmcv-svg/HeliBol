"use client";
import { motion } from "motion/react";
import { RatingStars } from "@web/buttons/rating-stars/rating-stars";

const quotes = [
  ["Ava Lin", "Design Eng · Northwind", "The AI prompts alone saved us a sprint. We paste, tweak tokens, ship.", 8],
  ["Kai Moreno", "Founder · Hooli", "Reduced motion that's designed, not bolted on. Our a11y audit flew by.", 3],
  ["Noor Haddad", "CTO · Globex", "Our landing page finally feels expensive. Conversion is up 18%.", 6],
  ["Leo Park", "Mobile lead · Acme", "Same springs on web and iOS. Nobody can tell which is which.", 2],
  ["Mila Rossi", "PM · Initech", "We replaced three animation libraries with one folder of source.", 5],
  ["Ezra Cole", "Indie hacker", "Shipped a paywall flow in an afternoon. It converts better than the old one.", 1],
] as const;

export function TestimonialsWall() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-14">
      <div className="text-center">
        <RatingStars defaultValue={5} label="Average rating" className="justify-center [&_svg]:size-5" />
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">4.9 from 2,000+ teams</h2>
      </div>
      <div className="mt-10 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
        {quotes.map(([n, r, q, img], i) => (
          <motion.figure key={n} initial={{ opacity: 0, y: 30, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: (i % 3) * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -4 }} className="mb-4 break-inside-avoid rounded-2xl border border-border bg-card p-5 shadow-sm">
            <blockquote className={i % 4 === 0 ? "text-lg leading-snug font-medium" : "text-sm leading-relaxed"}>“{q}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3"><img src={`/demo/photo-${img}.jpg`} alt="" className="size-9 rounded-full object-cover" /><div><p className="text-sm font-semibold">{n}</p><p className="text-xs text-muted-foreground">{r}</p></div></figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
