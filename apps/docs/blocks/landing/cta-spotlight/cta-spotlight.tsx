"use client";
import { BgMeteors } from "@web/backgrounds/bg-meteors/bg-meteors";
import { ButtonMagnetic } from "@web/buttons/button-magnetic/button-magnetic";
import { Spotlight } from "@web/cursor/spotlight/spotlight";
import { TextGradientAnimated } from "@web/text/text-gradient-animated/text-gradient-animated";

export function CtaSpotlight() {
  return (
    <section className="p-6">
      <Spotlight color="rgb(139 92 246 / .35)" className="rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_top,#1e1b4b,#09090b_70%)] text-white">
        <BgMeteors count={14} className="flex flex-col items-center px-6 py-20 text-center">
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Stop shipping <TextGradientAnimated>static</TextGradientAnimated> interfaces.
          </h2>
          <p className="mt-4 max-w-md text-white/60">Install your first component in 30 seconds. Free and open source.</p>
          <div className="mt-8">
            <ButtonMagnetic className="bg-white text-black">Get started — it&apos;s free</ButtonMagnetic>
          </div>
        </BgMeteors>
      </Spotlight>
    </section>
  );
}
