"use client";
import { Bot, Calendar, CreditCard, Lock, Mail, Zap } from "lucide-react";
import { HeroProductOrbit } from "./hero-product-orbit";

export default function Demo() {
  return (
    <HeroProductOrbit
      className="bg-[radial-gradient(ellipse_at_center,#1e1b4b,#05050a_70%)] text-white"
      product={
        <div className="grid size-28 place-items-center rounded-[2rem] bg-gradient-to-br from-violet-500 to-fuchsia-500 text-4xl font-black text-white shadow-[0_30px_80px_-10px_rgb(168_85_247/.7)]">K</div>
      }
      chips={[
        { icon: <Zap className="size-3.5 text-amber-300" />, label: "Instant sync" },
        { icon: <Lock className="size-3.5 text-emerald-300" />, label: "End-to-end encrypted" },
        { icon: <Bot className="size-3.5 text-sky-300" />, label: "AI drafts" },
        { icon: <Calendar className="size-3.5 text-rose-300" />, label: "Smart scheduling" },
        { icon: <Mail className="size-3.5 text-violet-300" />, label: "Unified inbox" },
        { icon: <CreditCard className="size-3.5 text-lime-300" />, label: "Built-in billing" },
      ]}
    >
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything orbits your work.</h1>
    </HeroProductOrbit>
  );
}
