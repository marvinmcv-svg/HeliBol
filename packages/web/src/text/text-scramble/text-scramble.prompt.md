Create a "decode" text effect: random glyphs resolve left-to-right into the final string on mount, and replay on hover and keyboard focus.

Keep: GSAP `ScrambleTextPlugin` inside `useGSAP()`, hover handlers wrapped in `contextSafe`, `overwrite: true` so rapid hovers don't stack, `aria-label` with the real text, and no scramble at all under reduced motion.
