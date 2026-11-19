"use client";
import { DemoScroller } from "@web/_demo";
import { TemplateAiStartup } from "./template-ai-startup";

export default function Demo() {
  return (
    <DemoScroller thumbAt={0}>
      <TemplateAiStartup />
    </DemoScroller>
  );
}
