"use client";
import { DemoCenter, photos } from "../../_demo";
import { WidgetVinyl } from "./widget-vinyl";

export default function Demo() {
  return (
    <DemoCenter>
      <WidgetVinyl cover={photos[7]} title="Rose Quartz" artist="The Kinetik Sessions" />
    </DemoCenter>
  );
}
