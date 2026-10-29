Create a text entrance where each word fades in from `opacity 0`, `translateY(8px)` and `blur(8px)` to sharp, with a 50ms stagger, triggered once when it scrolls into view.

Keep: Motion variants with `staggerChildren` on a parent `motion.span` and `whileInView`; whitespace kept as plain spans so wrapping stays natural; `aria-label` on the wrapper and `aria-hidden` on fragments; reduced motion = opacity only.
