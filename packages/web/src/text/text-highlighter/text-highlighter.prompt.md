Create an inline highlighter: a `<mark>` whose background (a solid linear-gradient) grows from 0% to 100% width with an expo-out transition when it enters view, wrapping correctly across lines via `box-decoration-break: clone`.

Keep: marker (88% height, offset low) and underline (0.18em at bottom) variants, IntersectionObserver toggling a `data-in` attribute, CSS transition only, reduced motion = instant.
