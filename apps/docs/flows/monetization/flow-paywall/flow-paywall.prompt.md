Build a subscription paywall screen (dark, violet glow at the top).

Layout: close button, two-line headline, 4 feature rows with check bullets, 3 plan cards (Yearly w/ "Save 58%" badge, Monthly, Lifetime) as a radio group, a "Free 7-day trial" switch row, primary CTA pinned to the bottom, "Cancel anytime · Restore purchases" footnote.

Motion spec:
- Feature rows: fade + slide from x -12, staggered 60ms (spring 260/30).
- Plan selection: a single highlight ring + radio dot move between cards as a shared element (spring 500/35); light haptic on change.
- Trial switch: spring thumb; CTA label swaps "Start free trial" ↔ "Subscribe".
- CTA: a soft light band sweeps across every ~2.8s; press scale .97.
- Success: content fades out, a green check circle pops [0 → 1.15 → 1], success haptic.
