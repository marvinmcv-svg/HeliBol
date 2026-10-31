import { CardNeon } from "./card-neon";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 p-8">
      <CardNeon className="w-72 p-6 text-white">
        <p className="text-xs tracking-widest text-white/50 uppercase">Night mode</p>
        <h3 className="mt-1 text-2xl font-semibold">Neon Pro</h3>
        <p className="mt-2 text-sm text-white/60">Glow-in-the-dark dashboards for your 2am deploys.</p>
      </CardNeon>
    </div>
  );
}
