"use client";
import { DemoCenter, photos } from "../../_demo";
import { LayoutStackGrid } from "./layout-stack-grid";

const names = ["Coral dunes", "Fjord light", "Night market", "Glass house", "Desert road", "Canopy", "Salt flats", "Harbour"];

export default function Demo() {
  return (
    <DemoCenter className="p-6">
      <LayoutStackGrid defaultMode="grid" className="w-full max-w-2xl" items={names.map((title, i) => ({ id: title, title, src: photos[i % photos.length]!, meta: `${3 + i} photos` }))} />
    </DemoCenter>
  );
}
