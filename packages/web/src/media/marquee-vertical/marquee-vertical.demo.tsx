import { photos } from "../../_demo";
import { MarqueeVertical } from "./marquee-vertical";

const quotes = [
  ["Shipped our launch page in an afternoon.", "Ava, Design lead"],
  ["The reduced-motion fallbacks sold our accessibility team.", "Leo, Engineering"],
  ["Finally, GSAP and Motion pieces that agree on timing.", "Noor, Motion"],
  ["The AI prompts are scarily good.", "Kai, Product"],
  ["Our conversion went up after the new hero.", "Sam, Growth"],
  ["Copy, paste, tweak tokens, done.", "Mia, Freelance"],
];

const card = (q: string[], i: number) => (
  <figure className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm">
    <blockquote className="text-card-foreground">“{q[0]}”</blockquote>
    <figcaption className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
      <img src={photos[i % photos.length]} alt="" className="size-6 rounded-full object-cover" />
      {q[1]}
    </figcaption>
  </figure>
);

const rotate = (n: number) => [...quotes.slice(n), ...quotes.slice(0, n)].map((q, i) => card(q, i + n));

export default function Demo() {
  return (
    <div className="h-full p-4">
      <MarqueeVertical columns={[rotate(0), rotate(2), rotate(4)]} className="mx-auto max-w-3xl" />
    </div>
  );
}
