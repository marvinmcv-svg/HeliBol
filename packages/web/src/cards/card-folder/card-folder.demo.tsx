"use client";
import { CardFolder } from "./card-folder";
export default function Demo() {
  const paper = (n: number) => <img src={`/demo/photo-${n}.jpg`} alt="" className="h-full w-full object-cover" />;
  return (
    <div className="flex h-full w-full items-end justify-center gap-10 p-10 pb-16">
      <CardFolder label="Photos" papers={[paper(1), paper(4), paper(7)]} />
      <CardFolder label="Designs" color="#f59e0b" papers={[paper(3), paper(6), paper(8)]} />
    </div>
  );
}
