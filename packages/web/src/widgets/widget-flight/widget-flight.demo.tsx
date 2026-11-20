"use client";
import { DemoCenter } from "../../_demo";
import { WidgetFlight } from "./widget-flight";

export default function Demo() {
  return (
    <DemoCenter>
      <WidgetFlight flight="KN 207" from={{ code: "LIS", city: "Lisbon", time: "09:40" }} to={{ code: "CPH", city: "Copenhagen", time: "14:25" }} />
    </DemoCenter>
  );
}
