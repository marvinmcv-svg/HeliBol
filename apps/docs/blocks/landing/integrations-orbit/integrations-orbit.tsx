"use client";
import { Cloud, Code2, Database, GitBranch, Mail, MessageSquare, Shield, Zap } from "lucide-react";
import { OrbitIcons } from "@web/data/orbit-icons/orbit-icons";
import { TextFlipWords } from "@web/text/text-flip-words/text-flip-words";

export function IntegrationsOrbit() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-12 md:grid-cols-2">
      <div>
        <p className="text-sm font-medium text-brand">Integrations</p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight">Plugs into <TextFlipWords words={["GitHub", "Slack", "Postgres", "your stack"]} className="text-brand" /></h2>
        <p className="mt-3 text-muted-foreground">80+ integrations, one motion language. Connect once and every surface animates the same way.</p>
        <a href="#" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Browse integrations →</a>
      </div>
      <div className="grid place-items-center overflow-hidden">
        <OrbitIcons center={<span className="text-2xl font-bold">k</span>} rings={[{ radius: 80, duration: 20, icons: [<Code2 key="1" />, <Zap key="2" />, <Mail key="3" />] }, { radius: 145, duration: 34, reverse: true, icons: [<Cloud key="4" />, <Database key="5" />, <GitBranch key="6" />, <MessageSquare key="7" />, <Shield key="8" />] }]} />
      </div>
    </section>
  );
}
