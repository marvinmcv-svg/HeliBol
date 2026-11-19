"use client";
import { BannerAnnouncement } from "@web/navigation/banner-announcement/banner-announcement";
import { NavExpandable } from "@web/navigation/nav-expandable/nav-expandable";
import { ComparisonTable } from "@web/data/comparison-table/comparison-table";
import { HeroSplitText } from "../../landing/hero-split-text/hero-split-text";
import { SocialProofMarquee } from "../../landing/social-proof-marquee/social-proof-marquee";
import { FeaturesBento } from "../../landing/features-bento/features-bento";
import { IntegrationsOrbit } from "../../landing/integrations-orbit/integrations-orbit";
import { StatsImpact } from "../../landing/stats-impact/stats-impact";
import { TestimonialsWall } from "../../landing/testimonials-wall/testimonials-wall";
import { PricingToggle } from "../../pricing/pricing-toggle/pricing-toggle";
import { FaqSection } from "../../landing/faq-section/faq-section";
import { CtaSpotlight } from "../../landing/cta-spotlight/cta-spotlight";
import { FooterReveal } from "../../landing/footer-reveal/footer-reveal";

/**
 * Full SaaS launch page assembled from kinetik blocks, in conversion order:
 * announcement → floating nav → hero → logos → features → integrations → proof (stats,
 * testimonials) → pricing + comparison → FAQ → CTA → footer reveal.
 */
export function TemplateSaas() {
  return (
    <div className="relative bg-background text-foreground">
      <BannerAnnouncement items={[{ label: "New", text: "Launch week — 30% off annual plans", href: "#pricing" }, { text: "SOC 2 Type II certified", href: "#security" }]} />
      <div className="sticky top-3 z-40 flex justify-center px-4">
        <NavExpandable brand="◆ Northwind" links={[{ label: "Product", href: "#features", description: "Everything in one workspace" }, { label: "Integrations", href: "#integrations" }, { label: "Pricing", href: "#pricing", description: "Free for small teams" }, { label: "Docs", href: "#docs" }]} cta={<a href="#pricing" className="block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground">Start free</a>} />
      </div>
      <div className="-mt-14 min-h-[560px]"><HeroSplitText /></div>
      <SocialProofMarquee />
      <div id="features"><FeaturesBento /></div>
      <div id="integrations"><IntegrationsOrbit /></div>
      <StatsImpact />
      <TestimonialsWall />
      <div id="pricing"><PricingToggle /></div>
      <section className="mx-auto max-w-5xl px-6 pb-14">
        <ComparisonTable
          plans={[{ id: "free", name: "Free", price: "$0" }, { id: "pro", name: "Pro", price: "$12/mo", highlight: true }, { id: "team", name: "Team", price: "$40/mo" }]}
          rows={[
            { group: "Workspace", feature: "Members", values: { free: "3", pro: "Unlimited", team: "Unlimited" } },
            { feature: "Automations", values: { free: false, pro: true, team: true } },
            { group: "Security", feature: "SSO / SAML", values: { free: false, pro: false, team: true } },
            { feature: "Audit log", values: { free: false, pro: true, team: true } },
          ]}
        />
      </section>
      <FaqSection />
      <CtaSpotlight />
      <FooterReveal />
    </div>
  );
}
