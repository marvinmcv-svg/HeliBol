"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { ScrollCardsFan } from "./scroll-cards-fan";

const titles = ["Coral", "Fjord", "Neon", "Glass", "Dune", "Canopy", "Salt"];

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return <ScrollCardsFan container={s} cards={titles.map((title, i) => ({ src: photos[i % photos.length]!, title }))} />;
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.55}>
      <Inner />
    </DemoScroller>
  );
}
