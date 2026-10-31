"use client";
import { ButtonEmojiBurst } from "./button-emoji-burst";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-4 p-8">
      <ButtonEmojiBurst>Celebrate 🎉</ButtonEmojiBurst>
      <ButtonEmojiBurst emojis={["❤️", "💖", "💘"]} className="bg-rose-500 text-white">Send love</ButtonEmojiBurst>
    </div>
  );
}
