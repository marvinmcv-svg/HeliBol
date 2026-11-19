"use client";
import { WaitlistForm } from "@web/forms/waitlist-form/waitlist-form";
import { AiSuggestions } from "@web/ai/ai-suggestions/ai-suggestions";
import { HeroAiParticles } from "../../landing/hero-ai-particles/hero-ai-particles";
import { SocialProofMarquee } from "../../landing/social-proof-marquee/social-proof-marquee";
import { AiChatApp } from "../../ai/ai-chat-app/ai-chat-app";
import { FeaturesBento } from "../../landing/features-bento/features-bento";
import { FaqSection } from "../../landing/faq-section/faq-section";
import { FooterReveal } from "../../landing/footer-reveal/footer-reveal";

/**
 * AI startup page (MotionSites "AI product" pattern): particle-brain hero → logos → live product
 * shot (a working chat UI in a browser frame) → capabilities → waitlist → FAQ → footer.
 */
export function TemplateAiStartup() {
  return (
    <div className="relative bg-[#030014] text-white">
      <div className="p-3"><HeroAiParticles /></div>
      <div className="dark text-foreground"><SocialProofMarquee /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-violet-300">The product</p>
        <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight sm:text-4xl">It&apos;s not a demo. Try it.</h2>
        <div className="mx-auto mt-8 h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_40px_120px_-40px_rgb(124_58_237/.6)]">
          <div className="flex h-9 items-center gap-1.5 border-b border-white/10 px-3">{["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />)}</div>
          <div className="dark h-[calc(100%-2.25rem)] bg-background text-foreground"><AiChatApp /></div>
        </div>
      </section>
      <div className="dark bg-background text-foreground">
        <FeaturesBento />
        <section className="mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Be first in line</h2>
          <p className="text-muted-foreground">We&apos;re onboarding teams weekly. Ask it anything while you wait:</p>
          <AiSuggestions items={[{ icon: "🗓️", label: "Plan my launch week" }, { icon: "📨", label: "Draft replies to my inbox" }, { icon: "📊", label: "Summarise Q3 metrics" }]} />
          <WaitlistForm count={12840} avatars={["/demo/photo-1.jpg", "/demo/photo-2.jpg", "/demo/photo-3.jpg"]} />
        </section>
        <FaqSection />
        <FooterReveal />
      </div>
    </div>
  );
}
