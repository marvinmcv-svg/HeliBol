import { ButtonBorderBeam } from "./button-border-beam";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-5 p-8">
      <ButtonBorderBeam>✦ Introducing kinetik 1.0</ButtonBorderBeam>
      <ButtonBorderBeam colorFrom="#f97316" colorTo="#facc15" duration={2.2} className="rounded-xl">
        Join the waitlist
      </ButtonBorderBeam>
    </div>
  );
}
