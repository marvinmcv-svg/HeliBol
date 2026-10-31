"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { ZoomThrough } from "./zoom-through";
function Inner() {
  return <ZoomThrough container={useDemoScroller() ?? undefined} word="DIVE" image="/demo/photo-7.jpg" />;
}
export default function Demo() {
  return <DemoScroller><Inner /></DemoScroller>;
}
