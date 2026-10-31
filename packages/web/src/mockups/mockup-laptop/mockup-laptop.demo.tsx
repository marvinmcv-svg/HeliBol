import { MockupLaptop } from "./mockup-laptop";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <MockupLaptop>
        <div className="flex h-full"><div className="w-1/5 border-r border-border bg-muted/50 p-2 space-y-1.5">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-2 rounded bg-muted-foreground/20" />)}</div><div className="flex-1 p-3"><div className="grid grid-cols-3 gap-2">{[1, 4, 7].map((n) => <img key={n} src={`/demo/photo-${n}.jpg`} alt="" className="aspect-video rounded object-cover" />)}</div><div className="mt-2 h-20 rounded bg-gradient-to-r from-violet-500/30 to-cyan-500/30" /></div></div>
      </MockupLaptop>
    </div>
  );
}
