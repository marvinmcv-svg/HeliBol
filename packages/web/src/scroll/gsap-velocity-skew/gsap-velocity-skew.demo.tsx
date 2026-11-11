"use client";
import { DemoScroller, photoAlt, photos, useDemoScroller } from "../../_demo";
import { GsapVelocitySkew } from "./gsap-velocity-skew";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <GsapVelocitySkew scroller={s} className="px-6 pb-24 pt-10">
      <h3 className="mb-8 text-center text-4xl font-semibold tracking-tight">Scroll fast — it leans.</h3>
      <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4">
        {[...photos, ...photos].map((p, i) => (
          <figure key={i} data-skew className={i % 3 === 1 ? "translate-y-12" : ""}>
            <img src={p} alt={photoAlt[i % photos.length]} className="aspect-[3/4] w-full rounded-xl object-cover" />
            <figcaption className="mt-1 text-xs text-muted-foreground">{photoAlt[i % photos.length]}</figcaption>
          </figure>
        ))}
      </div>
    </GsapVelocitySkew>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
      <Inner />
    </DemoScroller>
  );
}
