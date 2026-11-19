"use client";
import { MarqueeVertical } from "@web/media/marquee-vertical/marquee-vertical";
import { TextSmartAnimate } from "@web/text/text-smart-animate/text-smart-animate";
import { PortfolioRibbon } from "../../portfolio/portfolio-ribbon/portfolio-ribbon";
import { BlogGrid } from "../../blog/blog-grid/blog-grid";
import { ContactSection } from "../../landing/contact-section/contact-section";
import { FooterReveal } from "../../landing/footer-reveal/footer-reveal";

const quotes = [
  ["Mara turned a brief into a brand our customers talk about.", "Head of Brand, Halo"],
  ["The fastest, calmest creative partner we've worked with.", "Founder, Orvo"],
  ["Every frame had a reason to exist.", "Creative Director, Field"],
  ["She made our book feel like an object, not a PDF.", "Editor, Saffron Press"],
];

/** Independent creative's portfolio: 3D ribbon opener → about → selected work grid → kind words → contact → footer reveal. */
export function TemplatePortfolio() {
  return (
    <div className="relative bg-[#ece8df] text-zinc-900">
      <div className="p-3"><PortfolioRibbon /></div>
      <section id="about" className="mx-auto grid max-w-5xl gap-8 px-6 py-16 md:grid-cols-[1fr_2fr]">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">About</p>
        <p className="text-2xl leading-snug tracking-tight sm:text-3xl">
          Art director for <TextSmartAnimate words={["brands", "books", "films", "spaces"]} className="font-semibold" /> that need to feel inevitable. Twelve years, four studios, one rule: motion must mean something.
        </p>
      </section>
      <div id="work" className="rounded-t-[2rem] bg-background text-foreground"><BlogGrid /></div>
      <section className="h-[420px] bg-background px-6 pb-10">
        <MarqueeVertical
          className="mx-auto h-full max-w-4xl"
          columns={[0, 1, 2].map((c) => quotes.map((_, i) => quotes[(i + c) % quotes.length]).map((q) => (
            <figure key={q[0]} className="rounded-2xl border border-border bg-card p-4 text-sm"><blockquote>“{q[0]}”</blockquote><figcaption className="mt-2 text-xs text-muted-foreground">{q[1]}</figcaption></figure>
          )))}
        />
      </section>
      <div id="contact" className="bg-background text-foreground"><ContactSection /></div>
      <FooterReveal />
    </div>
  );
}
