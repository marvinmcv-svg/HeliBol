Build a headline reveal where each line (or word/char) slides up from behind an invisible mask with an expo-out ease and a short stagger, triggered when the heading scrolls into view.

Key details to preserve:
- Use GSAP `SplitText` with `mask: "lines"` and `autoSplit: true` so it re-splits on resize/font-load, and return the tween from `onSplit`.
- Run inside `useGSAP()` so everything reverts on unmount; register `SplitText`, `ScrollTrigger` and `useGSAP` once.
- Hide the element with `visibility: hidden` until GSAP takes over to avoid a flash of unsplit text.
- Reduced motion: skip the split entirely and fade the element in.
