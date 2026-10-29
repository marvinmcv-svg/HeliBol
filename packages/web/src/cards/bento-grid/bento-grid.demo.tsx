import { BentoGrid, BentoTile } from "./bento-grid";

const fade = "[mask-image:linear-gradient(to_bottom,#000_40%,transparent)]";

export default function Demo() {
  return (
    <div className="h-full w-full overflow-auto p-4">
      <BentoGrid>
        <BentoTile
          className="sm:col-span-2"
          title="Live previews"
          description="Every component renders live — replay it, resize it, reduce it."
          visual={
            <div className={`flex gap-2 p-4 ${fade}`}>
              {[1, 3, 6, 7].map((n, i) => (
                <img key={n} src={`/demo/photo-${n}.jpg`} alt="" className="h-28 w-36 rounded-xl object-cover shadow-lg" style={{ rotate: `${(i - 1.5) * 4}deg` }} />
              ))}
            </div>
          }
        />
        <BentoTile
          title="Tokens"
          description="One motion language."
          visual={<div className={`space-y-2 p-5 font-mono text-[11px] text-muted-foreground ${fade}`}>{["spring.snappy 500/35", "ease.expoOut", "duration.base 220ms", "stagger.base 50ms"].map((t) => <div key={t} className="rounded-md border border-border bg-background px-2 py-1">{t}</div>)}</div>}
        />
        <BentoTile
          title="Search"
          description="⌘K over everything."
          visual={<div className={`p-5 ${fade}`}><div className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground">Search “scroll”…<span className="ml-0.5 inline-block h-3 w-px animate-pulse bg-foreground align-middle" /></div></div>}
        />
        <BentoTile
          className="sm:col-span-2"
          title="Web + mobile"
          description="Same springs on React and React Native."
          visual={<div className={`grid h-full place-items-center bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20 ${fade}`}><div className="flex gap-3"><div className="h-24 w-40 rounded-xl border border-border bg-background shadow-lg" /><div className="h-28 w-14 rounded-2xl border-2 border-foreground/70 bg-background shadow-lg" /></div></div>}
        />
      </BentoGrid>
    </div>
  );
}
