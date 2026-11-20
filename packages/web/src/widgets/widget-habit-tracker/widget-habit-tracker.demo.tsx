"use client";
import { DemoCenter } from "../../_demo";
import { WidgetHabitTracker } from "./widget-habit-tracker";

const done = [0, 1, 2, 4, 5, 7, 8, 9, 10, 13, 14, 15, 16, 18, 21, 22, 23, 24, 25, 28, 29, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40];

export default function Demo() {
  return (
    <DemoCenter>
      <WidgetHabitTracker habit="Morning run" defaultDone={done} />
    </DemoCenter>
  );
}
