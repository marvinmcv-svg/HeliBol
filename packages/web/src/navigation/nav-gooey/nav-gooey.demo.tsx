"use client";
import { Bell, Home, Search, Settings, User } from "lucide-react";
import { DemoCenter } from "../../_demo";
import { NavGooey } from "./nav-gooey";

const items = [
  { label: "Home", icon: <Home className="size-5" /> },
  { label: "Search", icon: <Search className="size-5" /> },
  { label: "Alerts", icon: <Bell className="size-5" /> },
  { label: "Profile", icon: <User className="size-5" /> },
  { label: "Settings", icon: <Settings className="size-5" /> },
];

export default function Demo() {
  return (
    <DemoCenter>
      <NavGooey items={items} />
    </DemoCenter>
  );
}
