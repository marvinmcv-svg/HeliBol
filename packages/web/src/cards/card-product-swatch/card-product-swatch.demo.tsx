"use client";
import { DemoCenter, photos } from "../../_demo";
import { CardProductSwatch } from "./card-product-swatch";

export default function Demo() {
  return (
    <DemoCenter>
      <CardProductSwatch
        title="Horizon Print"
        subtitle="Archival giclée"
        variants={[
          { name: "Coral", color: "#fdba74", image: photos[0]!, price: 120 },
          { name: "Fjord", color: "#93c5fd", image: photos[1]!, price: 140 },
          { name: "Dusk", color: "#c4b5fd", image: photos[2]!, price: 135 },
          { name: "Moss", color: "#86efac", image: photos[3]!, price: 150 },
        ]}
      />
    </DemoCenter>
  );
}
