"use client";
import { Marquee } from "./marquee";

const logos = ["Northwind", "Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark", "Wayne"];
const quotes = [
  ["Ava Lin", "The AI prompts alone saved us a sprint."],
  ["Kai Moreno", "Finally, reduced motion that's actually designed."],
  ["Noor Haddad", "Our landing page feels expensive now."],
  ["Leo Park", "Same springs on web and native. Chef's kiss."],
];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 py-6">
      <Marquee duration={25} controls className="px-0">
        {logos.map((l) => <span key={l} className="text-xl font-semibold tracking-tight text-muted-foreground/70">{l}</span>)}
      </Marquee>
      <Marquee duration={40} reverse gap="1rem">
        {quotes.map(([n, q], i) => (
          <figure key={n} className="w-64 shrink-0 rounded-2xl border border-border bg-card p-4">
            <blockquote className="text-sm">“{q}”</blockquote>
            <figcaption className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><img src={`/demo/photo-${i + 3}.jpg`} alt="" className="size-6 rounded-full object-cover" />{n}</figcaption>
          </figure>
        ))}
      </Marquee>
    </div>
  );
}
