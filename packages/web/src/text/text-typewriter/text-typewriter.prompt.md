Build a typewriter that types a phrase, pauses, deletes it, and moves to the next phrase in a list, with a 2px blinking caret.

Keep: a single `setTimeout` state machine (typing / holding / deleting); caret blink as a stepped opacity keyframe (`times: [0, .5, .5, 1]`) so it's crisp, not fading; all phrases in an `sr-only` span for screen readers; reduced motion swaps entire words with no typing.
