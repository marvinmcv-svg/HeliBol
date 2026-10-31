"use client";
import { Cloud, Code2, Database, GitBranch, Mail, MessageSquare, Zap } from "lucide-react";
import { OrbitIcons } from "./orbit-icons";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center overflow-hidden p-4"><OrbitIcons center={<span className="text-xl font-bold">k</span>} rings={[{ radius: 70, duration: 18, icons: [<Code2 key="a" />, <Zap key="b" />, <Mail key="c" />] }, { radius: 130, duration: 30, reverse: true, icons: [<Cloud key="d" />, <Database key="e" />, <GitBranch key="f" />, <MessageSquare key="g" />] }]} /></div>;
}
