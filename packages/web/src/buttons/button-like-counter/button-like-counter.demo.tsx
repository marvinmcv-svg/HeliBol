"use client";
import { DemoCenter } from "../../_demo";
import { ButtonLikeCounter } from "./button-like-counter";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ButtonLikeCounter count={1299} />
        <ButtonLikeCounter count={48} defaultLiked />
        <ButtonLikeCounter count={23999} />
      </div>
      <p className="text-xs text-muted-foreground">Watch only the changing digits roll</p>
    </DemoCenter>
  );
}
