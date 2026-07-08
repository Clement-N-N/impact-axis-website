# Triage: what you can verify vs. what needs a human

## What you can check yourself

- **Whether a CSS feature is in the target matrix.** Cross-reference against
  `references/build-pipeline.md` and, when in doubt, current caniuse.com data
  for the specific feature against Chrome 111 / Edge 111 / Firefox 111 /
  Safari 16.4.
- **Whether the build pipeline already handles something.** Read the
  compiled/dev CSS output for a utility class if you're unsure whether
  Lightning CSS already prefixed or transformed it, rather than assuming
  either way.
- **Chrome rendering**, if a browser automation tool is available in this
  session — you can load the actual page and look at it, which is strictly
  better evidence than reading the code.
- **Static code-level risks**: unprefixed viewport units in mobile-critical
  paths, sticky elements gaining a transformed ancestor, missing font format
  fallbacks, use of an API not yet supported anywhere in the target matrix.

## What you cannot verify yourself, and must flag

- **Safari/WebKit-specific rendering or animation smoothness.** There is no
  WebKit engine available to render against in this environment. Any claim
  about "this will look right in Safari" beyond "the CSS feature is
  documented as supported at this version" is a guess, not a verified fact —
  say so explicitly in your report.
- **Firefox/Gecko-specific rendering.** Same limitation, same rule.
- **Real mobile device behavior** — actual iOS Safari with a real dynamic
  toolbar, actual Android Chrome with real OS-level font rendering. Emulated
  viewport sizes in a desktop browser approximate this but don't reproduce
  toolbar-collapse behavior, which is the entire reason the `dvh` fix in
  SKILL.md Step 2 matters. If a fix targets that specific behavior, say
  explicitly that it needs verification on a real device, not just a resized
  browser window.
- **Animation performance/jank claims.** "This might be smoother in Safari"
  is a hypothesis based on general compositor behavior, not a measurement.
  Don't report a performance fix as confirmed without an actual before/after
  comparison from someone who ran it.

## How to phrase flagged items in your report

Bad: "Fixed Safari compatibility issue in HeroBackgroundSlideshow."
(Implies verification that didn't happen.)

Good: "Confirmed `clip-path` + GSAP is used for the crossfade; this is
correctness-safe across the target matrix but Safari's compositor has
historically been less consistent about hardware-accelerating `clip-path`
transitions than Chrome's. No code change made — flagging for a manual look
on an actual Safari/iOS device if jank has been reported, since this isn't
something verifiable from code alone."

The goal is the same as the sibling skills: a clearly-labeled "I couldn't
verify this, here's what to check and why" is a successful, useful outcome —
not a fallback for when the skill "couldn't finish."

## Suggested manual QA matrix

When a fix specifically targets cross-browser behavior, the practical
minimum to ask a human to check is the four engines Next.js itself commits
to supporting: current Chrome, current Firefox, current Safari (macOS), and
Safari on an actual iOS device (not just macOS Safari resized — iOS Safari's
dynamic toolbar behavior is the specific thing most viewport-height fixes in
this app are about). Edge shares Chromium's engine with Chrome, so it's
low-priority to check separately unless a fix specifically touches an
Edge-only quirk (rare).
