"use client";
import { DemoCenter, photos } from "../../_demo";
import { MediaPolaroidStack } from "./media-polaroid-stack";

const captions = ["summer '24 ☀︎", "the long drive", "lake day", "mum's garden", "first snow", "rooftop"];

export default function Demo() {
  return (
    <DemoCenter className="bg-[radial-gradient(circle_at_50%_40%,#e7e1d4,transparent_70%)]">
      <MediaPolaroidStack photos={captions.map((caption, i) => ({ src: photos[i]!, caption }))} />
    </DemoCenter>
  );
}
