"use client";
import { Calendar, Camera, Compass, Mail, Music, Settings, Terminal } from "lucide-react";
import { DockMagnify } from "./dock-magnify";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-end justify-center bg-[url(/demo/photo-2.jpg)] bg-cover bg-center p-6">
      <DockMagnify
        items={[
          { label: "Finder", icon: <Compass /> },
          { label: "Mail", icon: <Mail /> },
          { label: "Calendar", icon: <Calendar /> },
          { label: "Music", icon: <Music /> },
          { label: "Photos", icon: <Camera /> },
          { label: "Terminal", icon: <Terminal /> },
          { label: "Settings", icon: <Settings /> },
        ]}
      />
    </div>
  );
}
