"use client";
import { Bell, Heart, Home, Search, User } from "lucide-react";
import { NavBottomBar } from "./nav-bottom-bar";
export default function Demo() {
  return <div className="flex h-full w-full items-end justify-center p-8"><NavBottomBar items={[{ icon: <Home />, label: "Home" }, { icon: <Search />, label: "Search" }, { icon: <Heart />, label: "Saved" }, { icon: <Bell />, label: "Alerts" }, { icon: <User />, label: "Profile" }]} /></div>;
}
