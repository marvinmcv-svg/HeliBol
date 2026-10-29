Build a scroll-scrubbed paragraph: each word starts at 15% opacity and reaches 100% as the paragraph moves from 85% to 40% of the viewport, word ranges evenly divided across the scroll progress.

Keep: Motion `useScroll({ target, offset: ["start 0.85", "end 0.4"] })` and one `useTransform` per word, optional `container` ref, aria-label sentence with aria-hidden words, reduced motion = static paragraph.
