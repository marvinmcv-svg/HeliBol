"use client";
import { useEffect, useState } from "react";
import { DemoCenter } from "../../_demo";
import { LoaderLiquid } from "./loader-liquid";

export default function Demo() {
  const [v, setV] = useState(12);
  useEffect(() => {
    const id = setInterval(() => setV((x) => (x >= 100 ? 8 : Math.min(100, x + 11))), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <DemoCenter className="gap-10">
      <LoaderLiquid value={v} label="Uploading" />
      <LoaderLiquid size={90} color="#14b8a6" label="Syncing" />
    </DemoCenter>
  );
}
