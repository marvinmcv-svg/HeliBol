"use client";
import { DemoCenter, photos } from "../../_demo";
import { CardNowPlaying } from "./card-now-playing";

export default function Demo() {
  return (
    <DemoCenter>
      <CardNowPlaying defaultExpanded track={{ title: "Low Tide Static", artist: "Marlowe & the Fern", cover: photos[2]!, duration: 214 }} />
    </DemoCenter>
  );
}
