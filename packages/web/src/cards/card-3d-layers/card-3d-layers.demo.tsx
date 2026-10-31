"use client";
import { Card3D, Card3DLayer } from "./card-3d-layers";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <Card3D className="w-80 rounded-3xl border border-border bg-card p-6 shadow-xl">
        <Card3DLayer depth={40}><p className="text-xl font-bold">Make things float in air</p></Card3DLayer>
        <Card3DLayer depth={60}><p className="mt-1 text-sm text-muted-foreground">Hover to see each layer lift to its own depth.</p></Card3DLayer>
        <Card3DLayer depth={100} className="mt-4"><img src="/demo/photo-1.jpg" alt="" className="aspect-video w-full rounded-2xl object-cover shadow-lg" /></Card3DLayer>
        <div className="mt-5 flex justify-between">
          <Card3DLayer depth={30}><span className="text-xs text-muted-foreground">Try now →</span></Card3DLayer>
          <Card3DLayer depth={50}><span className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background">Sign up</span></Card3DLayer>
        </div>
      </Card3D>
    </div>
  );
}
