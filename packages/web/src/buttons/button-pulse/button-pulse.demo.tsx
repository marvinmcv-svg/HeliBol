import { ButtonPulse } from "./button-pulse";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center gap-6 p-8"><ButtonPulse>● Go live</ButtonPulse><ButtonPulse className="bg-emerald-500">Join call</ButtonPulse></div>;
}
