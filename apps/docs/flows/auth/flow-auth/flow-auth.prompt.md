Build a phone-number sign-in flow for mobile: (1) "What's your number?" with formatted (555) 000-0000 display and blinking caret, "Send code" button disabled until 10 digits; (2) "Enter the code" with four code cells; (3) verified screen.

Motion spec:
- Screens slide horizontally (enter from +40px, exit to -40px) with spring 260/30.
- Keypad keys: press scale .88 with a gray highlight; light haptic per key.
- Code digits pop in (scale .3→1, bouncy spring 400/15); the active cell has a violet border.
- Wrong code: error haptic + horizontal shake [0,-12,12,-8,8,-3,0] over 450ms, then clear.
- Correct code: success haptic, circle then checkmark draw (pathLength), screen pops in with a bouncy spring.
