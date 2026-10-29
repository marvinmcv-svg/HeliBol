Build a stat counter that animates from 0 to a target number with an expo-out ease once it scrolls into view, formatted with `Intl.NumberFormat` (decimals, prefix, suffix).

Keep: Motion `useMotionValue` + `animate()` and write `textContent` in `useMotionValueEvent` (no per-frame re-render), `tabular-nums`, `useInView({ once: true })`, reduced motion jumps to the final value.
