import { ButtonPress } from "./button-press";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-3 p-8">
      <ButtonPress>Get started</ButtonPress>
      <ButtonPress variant="secondary">Book a demo</ButtonPress>
      <ButtonPress variant="ghost">Learn more →</ButtonPress>
      <ButtonPress size="lg">Large primary</ButtonPress>
    </div>
  );
}
