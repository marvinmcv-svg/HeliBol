import { MockupBrowser } from "./mockup-browser";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <MockupBrowser url="marvzkineticlibrary.vercel.app" className="w-full max-w-xl">
        <div className="relative aspect-[16/9] overflow-hidden"><img src="/demo/photo-1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 grid place-items-center bg-black/30 text-center text-white"><div><p className="text-3xl font-semibold">Your product, framed.</p><p className="text-sm opacity-80">Drop any screenshot inside</p></div></div></div>
      </MockupBrowser>
    </div>
  );
}
