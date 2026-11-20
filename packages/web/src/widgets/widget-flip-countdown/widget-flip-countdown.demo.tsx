"use client";
import { useState } from "react";
import { DemoCenter } from "../../_demo";
import { WidgetFlipCountdown } from "./widget-flip-countdown";

export default function Demo() {
  const [to] = useState(() => new Date(Date.now() + ((3 * 24 + 7) * 3600 + 42 * 60 + 9) * 1000));
  return (
    <DemoCenter>
      <WidgetFlipCountdown to={to} title="Kinetik 3.0 launches in" />
    </DemoCenter>
  );
}
