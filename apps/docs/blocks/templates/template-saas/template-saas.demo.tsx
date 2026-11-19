"use client";
import { DemoScroller } from "@web/_demo";
import { TemplateSaas } from "./template-saas";

export default function Demo() {
  return (
    <DemoScroller thumbAt={0}>
      <TemplateSaas />
    </DemoScroller>
  );
}
