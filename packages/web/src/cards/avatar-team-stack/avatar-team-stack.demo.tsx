"use client";
import { DemoCenter, photos } from "../../_demo";
import { AvatarTeamStack } from "./avatar-team-stack";

const team = [
  { name: "Ava Chen", role: "Design lead", image: photos[0] },
  { name: "Leo Martins", role: "Engineering", image: photos[1] },
  { name: "Noor Haddad", role: "Motion", image: photos[2] },
  { name: "Kai Tanaka", role: "Product", image: photos[3] },
  { name: "Sam Okafor", role: "Research", image: photos[4] },
];

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-8 pb-16">
      <p className="text-sm text-muted-foreground">Hover or tab into the team</p>
      <AvatarTeamStack members={team} />
    </DemoCenter>
  );
}
