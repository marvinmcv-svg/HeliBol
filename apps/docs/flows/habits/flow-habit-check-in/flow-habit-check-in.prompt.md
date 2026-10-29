Build a daily habit check-in screen (dark): date + "Today" header, a card with a progress ring (orange→yellow gradient) around a 🔥 emoji plus "Current streak N days", then 4 habit rows (tinted icon tile, label, round check button), and a celebration banner when all are done.

Motion spec:
- Checking a habit: medium haptic; the check circle fills with the habit color and pops [1, 1.25, 1]; 8 particles burst radially 22px (expo-out, 500ms); label dims with strikethrough.
- Ring: pathLength springs to done/total (spring 120/20).
- All done: success haptic, streak number rolls up (+1) with a bouncy spring, the flame pops, and the banner slides up from the bottom.
