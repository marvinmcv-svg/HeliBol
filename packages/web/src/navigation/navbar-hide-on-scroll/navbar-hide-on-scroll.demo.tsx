"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { NavbarHideOnScroll } from "./navbar-hide-on-scroll";

function Page() {
  const c = useDemoScroller() ?? undefined;
  return (
    <>
      <NavbarHideOnScroll container={c}>
        <span className="font-semibold">◆ Northwind</span>
        <span className="text-muted-foreground">Product</span>
        <span className="text-muted-foreground">Pricing</span>
        <span className="ml-auto rounded-full bg-foreground px-3 py-1 text-xs text-background">Sign up</span>
      </NavbarHideOnScroll>
      <div className="space-y-4 p-6">
        <p className="text-sm text-muted-foreground">Scroll down: the bar shrinks into a floating pill, hides while you read, and returns the moment you scroll up.</p>
        {photos.slice(0, 5).map((p) => <img key={p} src={p} alt="" className="aspect-[16/7] w-full rounded-2xl object-cover" />)}
      </div>
    </>
  );
}

export default function Demo() {
  return (
    <DemoScroller hint={false}>
      <Page />
    </DemoScroller>
  );
}
