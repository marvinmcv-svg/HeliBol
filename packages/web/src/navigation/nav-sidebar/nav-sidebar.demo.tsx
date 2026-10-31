"use client";
import { BarChart3, Calendar, Home, Inbox, Settings, Users } from "lucide-react";
import { NavSidebar } from "./nav-sidebar";
export default function Demo() {
  return (
    <div className="flex h-full w-full">
      <NavSidebar brand="Northwind" items={[{ icon: <Home />, label: "Home" }, { icon: <Inbox />, label: "Inbox", badge: 4 }, { icon: <BarChart3 />, label: "Analytics" }, { icon: <Calendar />, label: "Calendar" }, { icon: <Users />, label: "Team" }, { icon: <Settings />, label: "Settings" }]} />
      <div className="flex-1 p-6 text-sm text-muted-foreground">Content area — collapse the sidebar with the button at the bottom.</div>
    </div>
  );
}
