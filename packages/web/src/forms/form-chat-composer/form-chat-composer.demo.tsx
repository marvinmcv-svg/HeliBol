"use client";
import { DemoCenter } from "../../_demo";
import { FormChatComposer } from "./form-chat-composer";

export default function Demo() {
  return (
    <DemoCenter>
      <FormChatComposer
        initial={[
          { id: 1, text: "Hey! Did the new hero land?", me: false },
          { id: 2, text: "Yes — shipping it tonight 🚀", me: true },
          { id: 3, text: "Send me the brief when you can", me: false },
        ]}
      />
    </DemoCenter>
  );
}
