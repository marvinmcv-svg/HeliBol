"use client";
import { NavMegaMenu } from "./nav-mega-menu";
const link = (t: string, d: string, e: string) => <a key={t} href="#" className="flex gap-3 rounded-xl p-2 hover:bg-accent"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-lg">{e}</span><span><span className="block text-sm font-medium">{t}</span><span className="block text-xs text-muted-foreground">{d}</span></span></a>;
export default function Demo() {
  return (
    <div className="flex h-full w-full justify-center p-6 pt-10">
      <NavMegaMenu items={[
        { label: "Products", content: <div className="grid w-[30rem] grid-cols-2 gap-1">{[link("Payments", "Online & in person", "💳"), link("Billing", "Subscriptions", "🧾"), link("Connect", "Marketplaces", "🔗"), link("Radar", "Fraud prevention", "🛡️")]}</div> },
        { label: "Solutions", content: <div className="w-64 space-y-1">{[link("Startups", "Launch fast", "🚀"), link("Enterprise", "Scale globally", "🏢")]}</div> },
        { label: "Developers", content: <div className="flex w-96 gap-3"><img src="/demo/photo-3.jpg" alt="" className="w-32 rounded-xl object-cover" /><div className="space-y-1">{[link("Docs", "Guides & API", "📘"), link("Changelog", "What's new", "✨")]}</div></div> },
      ]} />
    </div>
  );
}
