Build a mobile checkout: "Your bag" with a product card (image, title, variant, price) and a pill quantity stepper whose number rolls vertically on change; a summary (subtotal, shipping, total); and a swipe-to-pay slider pinned at the bottom.

Motion spec:
- Swipe-to-pay: pan the white knob along the track; a green fill follows (width = x + knob); the label fades out over the first 120px. Release past 85% → snap to end (spring 500/35), success haptic, proceed; otherwise spring back (400/15). Tapping the knob also pays (accessibility).
- Quantity: press scale .85 + light haptic, digit rolls ±14px.
- Success: badge scales from 0 with -90° rotation on a bouncy spring.
