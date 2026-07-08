---
name: accessible-components
description: Make a specific component or page section in this Next.js/next-intl app accessible — semantic HTML, ARIA, keyboard support, motion, and color contrast — grounded in this codebase's actual patterns (Radix-free custom components, GSAP/framer-motion animation, bilingual en/fr copy via next-intl). Trigger whenever asked to "make X accessible", "add a11y to X", "fix keyboard nav on X", "add aria labels", "check contrast", "screen reader support for X", or when reviewing a component with icon-only buttons, custom dropdowns/menus, looping animation, or images. Conservative like its sibling responsive-components skill: fixes mechanical gaps (missing aria-hidden, missing keyboard handlers, missing prefers-reduced-motion) directly, but never invents real alt text, never silently swaps brand colors for contrast, and never hardcodes new user-facing strings outside the next-intl message files — those always get flagged for a human to fill in or approve.
---

# Making components accessible

This codebase has no accessibility linting (`eslint-plugin-jsx-a11y` isn't
installed) and no automated a11y tests, so component-level fixes only get
caught by hand today. Some parts of the app already do this well —
`Navbar.tsx`/`MobileNav.tsx`/`MegaMenu.tsx` use `aria-expanded`,
`aria-controls`, and `aria-hidden` correctly, and both close on Escape. Other
parts have real, verifiable gaps, most notably: the site logo currently
renders with `alt=""` (removing the home link's accessible name entirely),
and there is no `prefers-reduced-motion` handling anywhere despite the app
relying heavily on GSAP and Framer Motion for looping/triggered animation.

Same prime directive as the responsive-components skill: **a partial, honest
fix beats a confident, wrong one.** Structural and mechanical fixes (missing
`aria-hidden`, missing keyboard handlers, unguarded animation loops) are safe
to make directly. Anything that requires knowing what an image actually shows,
what a brand color should become, or how a complex animated widget should
behave for a screen reader user is a judgment call — draft your best answer if
useful, but always flag it rather than asserting it's final.

## Step 0 — Learn the house patterns before editing

Read `references/existing-patterns.md` first. It documents what this
codebase already does right (so you extend it instead of reinventing it) and
the specific real bugs already found here (so you recognize the same shape
elsewhere). Also note:
- User-facing strings go through `next-intl` (`useTranslations`, e.g.
  `MobileNav.tsx`'s `t = useTranslations("nav")`) with entries in
  `messages/en.json` and `messages/fr.json`. Any new `aria-label` or visible
  text you add must follow this pattern, not a hardcoded English string —
  flag the translation-file entries you'd need rather than inlining English
  text, unless the target file already hardcodes other UI strings the same
  way (some early components do; match what's already there).
- There's no accessible-name convention library (no Radix, no
  `@radix-ui/react-visually-hidden`) — if you need visually-hidden text,
  use a plain `sr-only`-style utility class consistent with Tailwind's
  built-in `sr-only`.

## Step 1 — Read the target completely

Read the whole component, plus:
- Any icon/image children it renders (are they decorative or meaningful?).
- Whether it's interactive (click handlers on non-native elements, custom
  dropdowns/menus/tabs).
- Whether it animates on mount, on loop, or on scroll (GSAP/Framer Motion
  imports are a signal to check `references/motion-and-focus.md`).
- Whether it's reused elsewhere (`grep` for the component name) — an
  accessible-name fix in a shared component (like `Button` or `Logo`) affects
  every caller, which is good, but double-check none of them pass content
  that would make a generic fix wrong.

## Step 2 — Fix categories

### Images and icons
- A decorative image or SVG used purely for visual effect (backgrounds,
  repeated icon-chip glyphs sitting next to their own text label) should be
  `alt=""` and/or `aria-hidden="true"` — several places in this codebase
  already do this correctly for icons (`HeadlineWithIcons.tsx`).
- An image or icon that conveys unique information (a logo that's also the
  home link, a program/story photo on a card, an icon-only button with no
  visible text) needs a real accessible name. **Don't invent the wording**
  for content images — you don't know what the photo depicts or what the
  content owner wants it to say. Propose a placeholder that's clearly a
  placeholder (e.g. `alt="TODO: describe this image"`) and flag it in your
  report, rather than guessing plausible-sounding copy that could ship
  wrong. For icon-only *controls* (buttons/links whose meaning is clear from
  context, like a close (X) button or a hamburger toggle), a direct
  `aria-label` is usually safe to write yourself — see
  `references/existing-patterns.md` for the exact wording style already used
  (`isOpen ? "Close menu" : "Open menu"` in `MobileNav.tsx`).

### Interactive elements
- Anything clickable that isn't a native `<button>` or `<a>` (a `div`/`span`
  with `onClick`) needs `role="button"`, `tabIndex={0}`, and an `onKeyDown`
  handler for Enter/Space — or, more simply, just become a real `<button>`.
  Prefer the native element; it's less code and fewer edge cases than
  reimplementing button semantics.
- Toggles (menus, accordions, tabs) need `aria-expanded` reflecting real
  state, and `aria-controls` pointing at the region they reveal — the
  existing mega menu and mobile nav already model this correctly, copy the
  pattern.
- Check `type="button"` is set on any `<button>` that isn't meant to submit a
  form (prevents accidental form submission if the component ever ends up
  inside one later) — `components/ui/Button.tsx` already does this.

### Motion
Read `references/motion-and-focus.md` before touching any GSAP/Framer Motion
code. In short: looping or attention-grabbing animation (icon morphing,
background crossfades, hover/scroll-triggered motion) should check
`prefers-reduced-motion` and skip or simplify itself when the user has that
preference set. This app currently has zero handling for it anywhere, so
you'll likely be adding the check for the first time in whatever component
you touch — do it locally in that component rather than trying to refactor
the whole animation system in one pass.

### Focus management and keyboard behavior
Verify, don't just add code: opening a menu/panel should let keyboard users
reach it, and closing it (via Escape or the toggle) should return focus
somewhere sensible. `MobileNav`/`Navbar` already close on Escape, but neither
moves focus into the opened panel or explicitly returns it to the trigger on
close — that's worth fixing, but because it interacts with GSAP's open/close
timing, treat it as something to propose and flag for a human to test
interactively rather than something you can verify purely by reading code
(see `references/motion-and-focus.md`).

### Color contrast
Read `references/color-contrast.md` for computed ratios of every brand color
pair currently in `app/globals.css`. Most pass comfortably; a couple
(`icon-peach`, and to a lesser extent `icon-blue`/`icon-green`) are right at
or barely above the minimum. **Never silently swap a brand color** to fix
contrast — that's a design decision. Report the measured ratio and where
it's used, and let a human decide whether to adjust the color, the context
it's used in, or accept it (e.g. it may be fine if it's only ever used at a
size/weight that qualifies for the lower "large text" threshold).

## Step 3 — What to flag instead of fixing

- Real alt text / image descriptions (Step 2 above)
- Any new user-facing string that should go in `messages/en.json`/`fr.json`
  but you're not sure how to phrase in both languages
- Brand color contrast (Step 2 above)
- Focus-order or DOM-restructuring changes that would alter visual layout
- Any component already flagged as complex by the responsive-components
  skill's triage checklist (GSAP timelines keyed to specific coordinates,
  collage/art-directed layouts) — if it's too risky to reflow, it's too risky
  to restructure for accessibility without the same human review

## Step 4 — Report back

For each component: what you fixed and why it's a safe, mechanical change;
what you flagged and what specifically a human needs to decide or write;
and, if you touched anything animated, a reminder to test with the OS-level
"reduce motion" setting on, since that can't be verified by reading code.
Run `npx prettier --write <file>` on anything you touch, matching the
existing convention.

## Never

- Don't invent alt text or translated copy — placeholder + flag instead.
- Don't change brand colors without flagging the tradeoff first.
- Don't add `eslint-plugin-jsx-a11y` or other new dependencies without being
  asked — this skill works with what's already installed.
- Don't touch components you weren't asked about, even to fix something you
  notice in passing — mention it in the report instead.
