"use client";
import { DemoCenter } from "../../_demo";
import { WidgetThermostat } from "./widget-thermostat";

export default function Demo() {
  return (
    <DemoCenter>
      <WidgetThermostat defaultTarget={23.5} current={19} />
    </DemoCenter>
  );
}
