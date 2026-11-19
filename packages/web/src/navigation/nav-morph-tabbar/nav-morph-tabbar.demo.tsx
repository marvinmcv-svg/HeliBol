"use client";
import { Compass, Heart, Home, MessageCircle, User } from "lucide-react";
import { DemoCenter } from "../../_demo";
import { NavMorphTabbar } from "./nav-morph-tabbar";

export default function Demo() {
  return (
    <DemoCenter>
      <NavMorphTabbar
        defaultIndex={1}
        tabs={[
          { label: "Home", icon: <Home className="size-5" />, color: "#e9d5ff" },
          { label: "Explore", icon: <Compass className="size-5" />, color: "#a5f3fc" },
          { label: "Saved", icon: <Heart className="size-5" />, color: "#fecdd3" },
          { label: "Inbox", icon: <MessageCircle className="size-5" />, color: "#d9f99d" },
          { label: "Profile", icon: <User className="size-5" />, color: "#fde68a" },
        ]}
      />
    </DemoCenter>
  );
}
