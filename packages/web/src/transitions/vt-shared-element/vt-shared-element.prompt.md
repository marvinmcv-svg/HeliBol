Implement a gallery → detail "shared element" transition using the native View Transitions API: give each card's image and title a unique `view-transition-name`, give the detail view's image/title the same names, and wrap the state change in `document.startViewTransition(() => flushSync(update))`.

Keep: a reusable `withViewTransition(update)` helper with fallback (no VT support or reduced motion → plain update), focus moved into the detail view, and names unique per item.
