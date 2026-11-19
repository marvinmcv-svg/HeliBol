"use client";
import { DemoScroller } from "@web/_demo";
import { TemplatePortfolio } from "./template-portfolio";

export default function Demo() {
  return (
    <DemoScroller thumbAt={0}>
      <TemplatePortfolio />
    </DemoScroller>
  );
}
