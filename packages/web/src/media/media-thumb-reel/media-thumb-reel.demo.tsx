"use client";
import { DemoCenter, photos } from "../../_demo";
import { MediaThumbReel } from "./media-thumb-reel";

const titles = ["Coral dunes", "Fjord light", "Night market", "Glass house", "Desert road"];

export default function Demo() {
  return (
    <DemoCenter>
      <MediaThumbReel className="w-full max-w-xl" items={titles.map((title, i) => ({ src: photos[i]!, title, meta: `Chapter ${i + 1}` }))} />
    </DemoCenter>
  );
}
