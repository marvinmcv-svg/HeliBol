"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { GsapThreeWaypoints, type Waypoint } from "./gsap-three-waypoints";

const waypoints: Waypoint[] = [
  { title: "The district", body: "Scroll to fly the camera.", position: [9, 8, 9], target: [0, 0, 0] },
  { title: "Street level", body: "Low and fast between the blocks.", position: [-4.8, 1.2, 4], target: [0, 1, -2] },
  { title: "The landmark", body: "Orbit the centrepiece.", position: [2.2, 3.8, 2.2], target: [0, 3.4, 0] },
  { title: "Bird's eye", body: "Everything at once.", position: [0, 16, 0.01], target: [0, 0, 0] },
];

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return <GsapThreeWaypoints scroller={s} waypoints={waypoints} />;
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.15}>
      <Inner />
    </DemoScroller>
  );
}
