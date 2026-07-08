# Animation and fonts

## GSAP and Framer Motion: mostly self-normalizing

Both libraries exist specifically to smooth over cross-browser animation
differences (transform origins, easing curve implementation, requestAnimationFrame
timing) — don't assume a GSAP or Framer Motion animation needs manual
per-browser branching just because it's animation. The places actually worth
attention are narrower than "anything animated":

**Compositor performance, not correctness.** `clip-path` animation
(`components/sections/home-hero/HeroBackgroundSlideshow.tsx` crossfades
between image layers by animating `clipPath` from a fully-clipped to
fully-visible inset) and combined transform+radius loops
(`components/sections/home-hero/HeadlineWithIcons.tsx`'s `IconChip` animates
`borderRadius` and `rotate` simultaneously, plus a separate `MorphSVGPlugin`
timeline recalculating an SVG `<path d>` on every step) are the kind of
animation where Safari's compositor has historically been less consistent
about hardware-accelerating every property than Chrome's. The animation will
still play correctly in every target browser — what can differ is smoothness
under load. This is not something to "fix" speculatively; it's something to
flag for manual visual comparison (Step 3 in SKILL.md) if the task is
specifically about a reported rendering/performance complaint, and to leave
alone otherwise.

**SVG path morphing is just attribute interpolation.** `MorphSVGPlugin`
computes intermediate path data in JavaScript and sets the `d` attribute
directly — this doesn't rely on any CSS animation feature or experimental
browser API, so it's uniformly supported everywhere SVG itself is supported
(universal in this app's target matrix). The only cross-browser variance is
cosmetic sub-pixel rendering/anti-aliasing of the resulting path, which is
not fixable or meaningfully different in a way worth chasing.

**Overlap with `prefers-reduced-motion`.** The `accessible-components` skill
in this repo covers adding `prefers-reduced-motion` handling to these same
animations (currently absent everywhere). If you're touching
`HeroBackgroundSlideshow.tsx` or `HeadlineWithIcons.tsx` for a cross-browser
performance fix, check whether reduced-motion handling is also on the table
in the same task — doing both in one pass avoids re-testing the same
animation twice across browsers.

## Fonts: format fallback gap

`styles/_fonts.scss` declares eight `@font-face` blocks for "PP Neue
Montreal" (four weights × two styles), each with exactly one `src`:

```scss
src: url("/fonts/pp-neue-montreal/NeueMontreal-Light.otf") format("opentype");
```

Raw OpenType (`.otf`) via `@font-face` renders correctly in every browser in
this app's target matrix — this is not a breakage. It is, however, a real
gap against best practice: `.woff2` is meaningfully smaller (commonly
30-50%) and is the format every browser in the target matrix prefers when
offered a choice, which matters for load performance and avoiding
flash-of-invisible-text on slow connections.

If asked to improve font-loading for a component or globally:
1. Check whether a `.woff2` version of each font file already exists
   somewhere in `public/fonts/pp-neue-montreal/`. If not, **don't fabricate
   one** — flag that the source `.otf` files need to be converted to
   `.woff2` (a build/asset step, not something to invent from nothing) and
   note the exact files affected.
2. Once a `.woff2` exists, list it first in a multi-source `src`, keeping
   `.otf` as the fallback — browsers use the first format they support:
   ```scss
   src:
     url("/fonts/pp-neue-montreal/NeueMontreal-Light.woff2") format("woff2"),
     url("/fonts/pp-neue-montreal/NeueMontreal-Light.otf") format("opentype");
   ```
3. Leave `font-display: swap` as-is — it's already set correctly on every
   `@font-face` block and is the right choice for avoiding invisible-text
   flashes while a custom font loads.
4. Don't touch the fallback stack in `app/globals.css`
   (`"PP Neue Montreal", ui-sans-serif, system-ui, sans-serif`) — it's
   already a reasonable generic fallback chain.

This app does not use `next/font` (Next's built-in font optimization/
self-hosting helper) — fonts are loaded via hand-written `@font-face` in
Sass instead. That's a bigger architectural question than a single
component fix; don't propose migrating to `next/font` unless specifically
asked, but it's fine to mention as a suggestion in your report if you're
already deep in font-loading code for another reason.
