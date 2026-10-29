"use client";
import { photos } from "../../_demo";
import { SmoothScroll, useLenis } from "./smooth-scroll";

function Nav() {
  const lenis = useLenis();
  return (
    <div className="sticky top-0 z-10 flex gap-2 border-b border-border bg-background/80 p-3 text-xs backdrop-blur">
      {["one", "two", "three"].map((id) => (
        <button key={id} onClick={() => lenis?.scrollTo(`#k-ss-${id}`, { offset: -50 })} className="rounded-full border border-border px-3 py-1 hover:bg-accent">
          Go to {id}
        </button>
      ))}
      <span className="ml-auto self-center text-muted-foreground">{lenis ? "Lenis active" : "Native scroll"}</span>
    </div>
  );
}

export default function Demo() {
  return (
    <SmoothScroll contained className="h-full">
      <Nav />
      <div className="space-y-6 p-6">
        {["one", "two", "three"].map((id, i) => (
          <section key={id} id={`k-ss-${id}`} className="space-y-3">
            <h3 className="text-2xl font-semibold capitalize">Section {id}</h3>
            <img src={photos[i * 2]} alt="" className="aspect-video w-full rounded-2xl object-cover" />
            <p className="text-sm text-muted-foreground">Wheel or trackpad here — momentum is interpolated (lerp 0.09) while the native scrollbar, find-in-page and keyboard scrolling keep working.</p>
          </section>
        ))}
      </div>
    </SmoothScroll>
  );
}
