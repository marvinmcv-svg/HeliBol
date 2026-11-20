"use client";
import { Compass, Heart, Home, Settings, User } from "lucide-react";
import { DemoCenter, photos } from "../../_demo";
import { NavDrawer3D } from "./nav-drawer-3d";

export default function Demo() {
  return (
    <DemoCenter>
      <div className="h-[460px] w-[300px] overflow-hidden rounded-[44px] border-[6px] border-zinc-800 shadow-2xl">
      <NavDrawer3D
        defaultOpen
        footer="Signed in as ava@studio.com"
        links={[
          { label: "Home", href: "#home", icon: <Home className="size-5" /> },
          { label: "Discover", href: "#discover", icon: <Compass className="size-5" /> },
          { label: "Saved", href: "#saved", icon: <Heart className="size-5" /> },
          { label: "Profile", href: "#profile", icon: <User className="size-5" /> },
          { label: "Settings", href: "#settings", icon: <Settings className="size-5" /> },
        ]}
      >
        <img src={photos[6]} alt="" className="h-1/2 w-full object-cover" />
        <div className="space-y-2 p-5 pt-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Today</p>
          <h3 className="text-2xl font-semibold tracking-tight">Ocean glass</h3>
          <p className="text-sm text-muted-foreground">Tap the page to close the menu.</p>
        </div>
      </NavDrawer3D>
      </div>
    </DemoCenter>
  );
}
