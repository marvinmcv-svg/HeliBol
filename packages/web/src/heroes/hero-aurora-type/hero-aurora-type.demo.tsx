import { HeroAuroraType } from "./hero-aurora-type";

export default function Demo() {
  return (
    <HeroAuroraType word="Lumen">
      <p className="text-sm text-white/60">A design studio for products that glow.</p>
      <a href="#work" className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-1.5 text-sm hover:bg-white/10">View work</a>
    </HeroAuroraType>
  );
}
