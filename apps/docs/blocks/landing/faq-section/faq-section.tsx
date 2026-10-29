"use client";
import { AccordionSmooth } from "@web/layout/accordion-smooth/accordion-smooth";
import { TextHighlighter } from "@web/text/text-highlighter/text-highlighter";

export function FaqSection() {
  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-[1fr_1.4fr]">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Questions, <TextHighlighter>answered</TextHighlighter>.</h2>
        <p className="mt-3 text-sm text-muted-foreground">Can&apos;t find what you need? Ask in our community — we reply within a day.</p>
      </div>
      <AccordionSmooth
        defaultOpen={["a"]}
        items={[
          { id: "a", title: "Is kinetik really free?", content: "Yes — MIT licensed. Components are source code in your repo, not a dependency you rent." },
          { id: "b", title: "Which frameworks are supported?", content: "React 19 / Next.js on the web, and Expo / React Native (Reanimated 4) for mobile flows." },
          { id: "c", title: "Will it bloat my bundle?", content: "Most components are CSS-only. Motion components can use LazyMotion (~4.6 KB). 3D is always lazy-loaded." },
          { id: "d", title: "How do AI prompts work?", content: "Each page has a Copy AI prompt button with intent, constraints, source and helpers — paste it into your coding agent." },
          { id: "e", title: "Accessibility?", content: "Every component honours prefers-reduced-motion and has keyboard parity for hover/drag interactions." },
        ]}
      />
    </section>
  );
}
