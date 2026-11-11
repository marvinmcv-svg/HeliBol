"use client";
import { useState } from "react";
import { DemoCenter } from "../../_demo";
import { NumberInput } from "./number-input";

export default function Demo() {
  const [guests, setGuests] = useState(2);
  const [budget, setBudget] = useState(150);
  return (
    <DemoCenter className="gap-8">
      <NumberInput label="Guests" value={guests} onChange={setGuests} min={1} max={8} />
      <NumberInput label="Nightly budget" value={budget} onChange={setBudget} min={50} max={500} step={10} format={(v) => `$${v}`} />
    </DemoCenter>
  );
}
