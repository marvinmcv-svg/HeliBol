Create a shimmer text effect for loading/"thinking" labels: text drawn at ~45% opacity of currentColor with a full-opacity band sweeping left→right on loop.

Keep: `background-clip: text` with a 250%-wide gradient, `color-mix(in oklab, currentColor 45%, transparent)` so it inherits any theme color, duration/spread as CSS variables, reduced motion = solid text.
