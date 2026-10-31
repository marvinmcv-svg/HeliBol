"use client";
import { Bluetooth, Moon, Volume2, Wifi } from "lucide-react";
import { ButtonNeumorph } from "./button-neumorph";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-5 bg-[#e6e9ef] p-8">
      <ButtonNeumorph defaultPressed><Wifi /></ButtonNeumorph>
      <ButtonNeumorph><Bluetooth /></ButtonNeumorph>
      <ButtonNeumorph defaultPressed><Moon /></ButtonNeumorph>
      <ButtonNeumorph><Volume2 /></ButtonNeumorph>
    </div>
  );
}
