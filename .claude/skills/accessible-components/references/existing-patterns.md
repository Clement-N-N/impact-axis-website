# Existing patterns: what to imitate, and real bugs already found

## Good patterns already in the codebase — extend these, don't reinvent them

**Disclosure state on custom menus** (`components/layout/Navbar.tsx`,
`components/layout/MobileNav.tsx`):
```tsx
<button
  aria-expanded={isMegaMenuOpen}
  aria-controls={MEGA_MENU_ID}
  ...
/>
```
Any toggle you add or touch should follow this exact shape: `aria-expanded`
bound to real state, `aria-controls` pointing at the id of the region it
reveals.

**Accessible names for icon-only toggles** (`components/layout/MobileNav.tsx`):
```tsx
<button aria-label={isOpen ? "Close menu" : "Open menu"} ... />
```
This is the wording style already established for icon-only controls whose
purpose is unambiguous from context — match this tone (short, literal,
action-first) rather than something more verbose.

**Decorative SVGs marked correctly** (`components/sections/home-hero/HeadlineWithIcons.tsx`,
`components/layout/MegaMenuBackdrop.tsx`):
```tsx
<svg aria-hidden="true" ...>
```
These icons sit next to their own visible label or are purely decorative
backdrops, so hiding them from assistive tech is correct — don't remove this
when touching these files, and add the same treatment to any other
icon-next-to-its-own-label pattern you find.

**Escape-to-close** (`Navbar.tsx`, `MobileNav.tsx`):
```tsx
if (e.key === "Escape") close();
```
Already present on both major disclosure widgets. If you add a new
menu/panel/modal, it needs the same handler.

## Real bugs already found — fix when you touch these, recognize the shape elsewhere

**`components/layout/Logo.tsx` — the home link has no accessible name:**
```tsx
// Current
<Link href="/">
  <Image src="/logos/impact_axis_black_transparent.png" alt="" ... />
</Link>
```
The image is the *only* content inside the link, and it's marked `alt=""` —
so a screen reader announces this link with no name at all. This is not a
decorative image; it's simultaneously the brand logo and the home-page link.
Fix: give the image real alt text (e.g. `alt="Impact Axis"` — check the
actual company/brand name style used elsewhere in the app, like the `<title>`
or footer, rather than guessing), or keep `alt=""` on the image but add
`aria-label="Impact Axis"` (or equivalent, translated) to the `Link` itself.
Either is valid; picking the exact wording is a quick judgment call, not one
that needs a placeholder, since the answer is just "the brand name."

**Content images with `alt=""` that may not actually be decorative:**
`CollageDarkHero.tsx`, `HeroBackgroundSlideshow.tsx`, `PromoCardHero.tsx`
(card photo), and `HeadlineWithIcons.tsx`'s `ImageChip` all currently use
`alt=""`. Some of these probably are genuinely decorative (full-bleed
background photography behind an overlay and headline) and `alt=""` is
correct. Others — especially `PromoCardHero`'s card image, which illustrates
a specific story/program a user might click into — likely convey real
content and should have a real description. Don't bulk-fix these the same
way; look at each one's role on the page (background wash vs. content
thumbnail) and follow Step 2 of SKILL.md: fix icon-only control labels
yourself, but flag real content-image descriptions with a placeholder rather
than inventing the copy.

## What "safe to fix directly" looks like here

Mechanical, structural fixes with one obviously-correct answer:
missing `aria-hidden` on a decorative icon that sits beside its own text,
missing `aria-expanded`/`aria-controls` on a toggle that already has working
open/close state, converting a clickable `div` to a real `<button>`, adding
`type="button"` where it's missing. These don't require knowing anything
about the brand, the content, or the design intent — just the existing code.
