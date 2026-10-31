import { CardHoverReveal } from "./card-hover-reveal";
export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-4 p-6">
      <CardHoverReveal image="/demo/photo-4.jpg" title="Emerald Canopy" subtitle="Field notes · 6 min" className="h-full">
        Walk through a forest rendered entirely in code. Every tree is a sine wave with opinions. <span className="underline">Read story →</span>
      </CardHoverReveal>
      <CardHoverReveal image="/demo/photo-5.jpg" title="Amber Road" subtitle="Travel · 4 min" className="h-full">
        A road trip with no destination and perfectly eased curves. <span className="underline">Read story →</span>
      </CardHoverReveal>
    </div>
  );
}
