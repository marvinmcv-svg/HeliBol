"use client";
import { Camera, FileText, Image, Mic, Video } from "lucide-react";
import { NavSpeedDial } from "./nav-speed-dial";
export default function Demo() {
  const actions = [{ icon: <Camera />, label: "Photo" }, { icon: <Video />, label: "Video" }, { icon: <Mic />, label: "Voice" }, { icon: <FileText />, label: "Note" }, { icon: <Image />, label: "Gallery" }];
  return <div className="flex h-full w-full items-end justify-around p-8 pb-10"><NavSpeedDial actions={actions} /><NavSpeedDial actions={actions.slice(0, 3)} layout="vertical" /></div>;
}
