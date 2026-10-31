import { MockupIphone } from "./mockup-iphone";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 p-6">
      <MockupIphone className="w-48 -rotate-6"><img src="/demo/photo-2.jpg" alt="App screenshot" className="h-full w-full object-cover" /></MockupIphone>
      <MockupIphone className="w-48 rotate-3">
        <div className="flex h-full flex-col bg-gradient-to-b from-violet-600 to-fuchsia-600 p-4 pt-14 text-white"><p className="text-2xl font-semibold">Good morning</p><p className="text-sm opacity-80">3 habits left today</p><div className="mt-auto rounded-2xl bg-white/15 p-3 text-sm backdrop-blur">🔥 12-day streak</div></div>
      </MockupIphone>
    </div>
  );
}
