"use client";
import { Marquee } from "@web/media/marquee/marquee";

const logos = ["Northwind", "Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark", "Wayne", "Tyrell"];
const quotes = [
  ["Ava Lin", "Design Eng, Northwind", "The AI prompts alone saved us a sprint."],
  ["Kai Moreno", "Founder, Hooli", "Reduced motion that's actually designed, not bolted on."],
  ["Noor Haddad", "CTO, Globex", "Our landing page finally feels expensive."],
  ["Leo Park", "Mobile lead, Acme", "Same springs on web and native. Chef's kiss."],
  ["Mila Rossi", "PM, Initech", "We replaced three animation libraries with one folder."],
  ["Ezra Cole", "Indie hacker", "Shipped a paywall flow in an afternoon."],
];

function Quote({ q, i }: { q: string[]; i: number }) {
  return (
    <figure className="w-72 shrink-0 rounded-2xl border border-border bg-card p-5">
      <blockquote className="text-sm leading-relaxed">“{q[2]}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <img src={`/demo/photo-${(i % 8) + 1}.jpg`} alt="" className="size-8 rounded-full object-cover" />
        <div><p className="text-sm font-medium">{q[0]}</p><p className="text-xs text-muted-foreground">{q[1]}</p></div>
      </figcaption>
    </figure>
  );
}

export function SocialProofMarquee() {
  return (
    <section className="space-y-10 py-14">
      <div className="space-y-4">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Trusted by teams who sweat the details</p>
        <Marquee duration={35} controls>
          {logos.map((l) => <span key={l} className="text-2xl font-semibold tracking-tight text-muted-foreground/60">{l}</span>)}
        </Marquee>
      </div>
      <div className="space-y-4">
        <Marquee duration={50} gap="1rem">{quotes.map((q, i) => <Quote key={q[0]} q={q} i={i} />)}</Marquee>
        <Marquee duration={50} gap="1rem" reverse>{[...quotes].reverse().map((q, i) => <Quote key={q[0]} q={q} i={i + 3} />)}</Marquee>
      </div>
    </section>
  );
}
