"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";
import { AnimatedTabs } from "@web/layout/animated-tabs/animated-tabs";
import { ButtonShimmer } from "@web/buttons/button-shimmer/button-shimmer";
import { ButtonPress } from "@web/buttons/button-press/button-press";

const plans = [
  { name: "Hobby", monthly: 0, yearly: 0, blurb: "For side projects", features: ["All CSS components", "Community support", "MIT license"] },
  { name: "Pro", monthly: 24, yearly: 19, blurb: "For product teams", features: ["Everything in Hobby", "Blocks & mobile flows", "Figma kit", "Priority support"], featured: true },
  { name: "Team", monthly: 79, yearly: 64, blurb: "For agencies", features: ["Everything in Pro", "5 seats", "Private registry", "SSO"] },
];

function Price({ value }: { value: number }) {
  return (
    <span className="relative inline-flex h-12 overflow-hidden text-5xl font-semibold tracking-tight tabular-nums">
      $
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }} transition={spring.smooth}>
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function PricingToggle() {
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple pricing</h2>
        <p className="mt-2 text-muted-foreground">Start free. Upgrade when your motion does.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <AnimatedTabs className="w-auto" defaultTab="yearly" onChange={(id) => setPeriod(id as "monthly" | "yearly")} tabs={[{ id: "monthly", label: "Monthly" }, { id: "yearly", label: "Yearly" }]} />
          <motion.span animate={{ opacity: period === "yearly" ? 1 : 0.4, scale: period === "yearly" ? 1 : 0.95 }} className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">Save 20%</motion.span>
        </div>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={cn("relative flex flex-col rounded-3xl border p-6", p.featured ? "border-foreground/20 bg-card shadow-xl md:-translate-y-2" : "border-border bg-card/60")}>
            {p.featured && <span className="absolute -top-3 left-6 rounded-full bg-foreground px-2.5 py-0.5 text-xs font-medium text-background">Most popular</span>}
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-muted-foreground">{p.blurb}</p>
            <div className="mt-5 flex items-end gap-1">
              <Price value={p[period]} />
              <span className="mb-1.5 text-sm text-muted-foreground">/mo</span>
            </div>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {p.features.map((f) => <li key={f} className="flex items-center gap-2"><Check className="size-4 text-emerald-500" />{f}</li>)}
            </ul>
            <div className="mt-6">{p.featured ? <ButtonShimmer className="w-full">Start 14-day trial</ButtonShimmer> : <ButtonPress variant="secondary" className="w-full rounded-full">Choose {p.name}</ButtonPress>}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
