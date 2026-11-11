import { BgAuroraBars } from "./bg-aurora-bars";

export default function Demo() {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-[#07040f] text-white">
      <BgAuroraBars />
      <div className="relative text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-pink-200/80">Now in beta</p>
        <h3 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Light up the launch.</h3>
      </div>
    </div>
  );
}
