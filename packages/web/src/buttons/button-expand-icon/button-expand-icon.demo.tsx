import { Download, Heart, Share2, Trash2 } from "lucide-react";
import { ButtonExpandIcon } from "./button-expand-icon";
export default function Demo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-3 p-8">
      <ButtonExpandIcon icon={<Heart />} label="Save to favorites" />
      <ButtonExpandIcon icon={<Share2 />} label="Share" className="bg-sky-600 text-white" />
      <ButtonExpandIcon icon={<Download />} label="Download PNG" className="bg-emerald-600 text-white" />
      <ButtonExpandIcon icon={<Trash2 />} label="Delete" className="bg-destructive text-white" />
    </div>
  );
}
