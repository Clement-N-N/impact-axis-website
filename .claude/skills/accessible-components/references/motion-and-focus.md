# Motion and focus management

## The gap: zero prefers-reduced-motion handling, heavy animation usage

GSAP and/or Framer Motion are imported in at least these files today:
`components/layout/Navbar.tsx`, `components/layout/MobileNav.tsx`,
`components/layout/MegaMenu.tsx`, `components/layout/MegaMenuBackdrop.tsx`,
`components/sections/home-hero/HeadlineWithIcons.tsx`,
`components/sections/home-hero/HeroBackgroundSlideshow.tsx`. None of them
check `prefers-reduced-motion`. For users who've turned that OS setting on
(commonly for vestibular disorders, motion sensitivity, or just preference),
every one of these currently plays full motion regardless.

Not every animation needs the same treatment — judge each by what it's doing:

- **Decorative looping animation with no functional purpose** (the icon
  morph/rotate loop in `HeadlineWithIcons.tsx`'s `IconChip`, the background
  crossfade in `HeroBackgroundSlideshow.tsx`) should stop looping or jump
  straight to an end state when reduced motion is requested — there's no
  information lost by doing so.
- **Transition animation that communicates state change** (mega menu
  open/close, mobile nav slide-in) should still *happen* in some form (the
  panel still needs to open) but can shorten duration and drop
  scale/translate flourishes down to a simple opacity change or instant
  toggle.

## How to implement it here

There's no existing helper for this, so add the check locally rather than
inventing a shared abstraction the first time you need one. The standard
approach:

```tsx
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

gsap.to(target, {
  duration: prefersReducedMotion ? 0 : TRANSITION_SECONDS,
  // ...
});
```

For GSAP specifically, GSAP ships a `matchMedia()` utility that's a cleaner
fit inside a `useEffect` than a one-off `window.matchMedia` check, and it
re-evaluates if the user changes the setting mid-session — prefer it in
components (like the ones above) that already set up GSAP timelines in
`useEffect`. Only reach for the plain `window.matchMedia` check for something
trivial and one-shot.

If you find yourself adding this same check to a third or fourth component,
that's a signal it's worth proposing a small shared hook (e.g.
`usePrefersReducedMotion()`) in your report — but don't build that
abstraction unprompted the first or second time; a local fix is more honest
about the current state of the codebase than a speculative shared utility.

## Focus management: propose, but flag for manual testing

`MobileNav` and `Navbar`'s mega menu both close on Escape (good), but neither:
- Moves focus into the opened panel when it appears (a keyboard user has to
  tab through everything before it to reach the newly-revealed content), nor
- Explicitly returns focus to the toggle button when the panel closes (focus
  can end up lost on a removed/hidden element).

Both are real gaps and both have a standard fix (focus the panel or its first
focusable child on open via a `ref` + `.focus()` call in the same effect that
runs the GSAP open animation; store the trigger element and refocus it on
close). The reason this is a "propose and flag" item rather than a
"fix directly" item is that these components animate open/closed with GSAP,
and calling `.focus()` at the wrong point in that timeline (before the panel
is visible, or while `display: none`/`visibility: hidden` is still applied)
silently fails or causes a visible jump. Write the fix, but tell the user to
verify it by actually tabbing through the component with a keyboard after
your change, not just by reading the diff.
