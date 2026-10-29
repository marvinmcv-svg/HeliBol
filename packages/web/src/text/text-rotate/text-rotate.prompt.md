Create a rotating word for headlines like "Build ___ interfaces": the current word slides up and blurs out while the next slides up from below, and the pill around it animates its width to the new word.

Keep: `AnimatePresence mode="popLayout"` with the word as `key`, a parent `motion.span layout` with a spring (stiffness 260, damping 30) for width, `overflow-hidden` mask, sr-only list of all words, reduced motion = crossfade.
