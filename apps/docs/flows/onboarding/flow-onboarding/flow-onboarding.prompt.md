Build a 3-page onboarding pager for a mobile app.

Screens: full-bleed hero image (top 70%) under a gradient tint, title + body anchored above the footer; footer has a page indicator and a primary button.

Motion spec:
- Pages: horizontal pager driven by a pan gesture; release past 60px or 400px/s velocity advances/returns; spring stiffness 260, damping 30.
- Parallax: the incoming hero image starts at scale 1.25 and offset 40px in the travel direction, settling to scale 1.05 / 0 over 1.2s expo-out.
- Copy: title then body rise 24px and fade in with 120ms/200ms delays (spring 120/20).
- Indicator: active dot width 8→24px, inactive opacity .35 (spring 500/35).
- CTA: on the last page the label morphs "Next →" → "Get started" (vertical swap) and the pill resizes.
- Haptics: light impact on page change, success notification on Get started.
