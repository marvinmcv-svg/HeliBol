Build an iOS-style profile & settings screen with a collapsing header.

Layout: large centered avatar, name + subtitle, grouped "Preferences" list with colored icon tiles and switches (Notifications, Haptics, Dark mode, Reduce motion), grouped "Account" list with chevrons.

Motion spec (all derived from scrollY on the UI thread — Reanimated `useAnimatedScrollHandler` + `interpolate`):
- Avatar: scale 1 → 0.4 and translateY 0 → -30 over 0–120pt.
- Large title fades out over 40–110pt; compact header title fades in over 90–130pt while the header background goes from transparent to 90% with blur.
- Switches: spring thumb (500/35) + light haptic. Rows highlight on press.
