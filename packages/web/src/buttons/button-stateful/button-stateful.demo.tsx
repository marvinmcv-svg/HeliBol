"use client";
import { ButtonStateful } from "./button-stateful";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 p-8">
      <ButtonStateful onAction={() => wait(1200)} successLabel="Saved">Save changes</ButtonStateful>
      <ButtonStateful onAction={() => wait(1000).then(() => Promise.reject())} errorLabel="Card declined">Pay $49</ButtonStateful>
    </div>
  );
}
