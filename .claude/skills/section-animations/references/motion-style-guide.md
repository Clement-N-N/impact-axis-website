# House motion style guide

This app's motion language is built from two sources: Emil Kowalski's
"Animations on the Web" principles (he's a design engineer at Linear,
formerly on Vercel's design team, and this framework is essentially the
distilled practice of how those companies think about interface motion),
and this codebase's own existing best example, `MegaMenu.tsx`'s open
animation. Where they agree — which is almost everywhere — that's the house
style. Where you need a number and neither gives you one, interpolate from
the closest documented case rather than guessing from scratch.

## The easing blueprint

- **`ease-out`-family curves** (GSAP: `power2.out`, `power3.out`; CSS:
  `cubic-bezier(0.215, 0.61, 0.355, 1)` and similar) — for anything
  **entering or exiting**: a section revealing on scroll, a menu opening.
  This is what almost everything in this skill uses. It starts fast and
  settles, which reads as responsive rather than sluggish.
- **`ease-in-out`-family curves** — only for things already on screen that
  move or morph in place. Rare in the "animate a static section" use case
  this skill covers.
- **Plain `ease` (CSS)** — hover/color transitions only. Not really this
  skill's territory (see `components/ui/Button.tsx`'s existing
  `transition-colors`, which is fine as-is and out of scope per SKILL.md).
- **`linear`** — avoid entirely for the kind of animation this skill adds.
  Reserve it for constant-speed effects like marquees, which aren't in
  scope here.
- **Avoid `ease-in`** for anything a user is meant to perceive as a
  response to scrolling into a section — a slow start delays the payoff and
  reads as sluggish.

## Duration

| What | Duration | Notes |
|---|---|---|
| Small chip/accent reveal | 150-250ms | Rare in this skill's scope |
| Content group fade-up (headline, paragraph block) | 400-600ms | The default for scroll reveals |
| Multi-group stagger, per-item offset | 60-100ms | Between each group's start, not each group's duration |
| Image scale-in | 400-600ms | Same range as content, slightly slower reads fine for larger elements |
| Continuous scroll-scrub parallax (`ParallaxImage.tsx`) | n/a (tied to scroll, not time) | `scrub: true` — no fixed duration, driven by scroll position |

Larger elements can afford slightly longer durations than small ones — this
is why a full headline+paragraph reveal (400-600ms) runs a bit longer than a
small UI transition (150-250ms) would in a different context. Exit
animations, where relevant, can run about 20% faster than entrances — mostly
not applicable here since this skill is about one-time reveals, not
open/close UI.

## The canonical recipe: MegaMenu's entrance, generalized

`components/layout/MegaMenu.tsx` already does exactly the shape of animation
this skill should produce elsewhere, just triggered by a menu opening rather
than a scroll position:

```tsx
gsap.set(targets, { opacity: 0, y: 12 });

gsap.timeline({ paused: true })
  .to(imageRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.1)
  .to(items, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "power3.out",
    stagger: { each: 0.07 },
  }, 0.18)
```

For a scroll-triggered section reveal, the shape is identical — only the
trigger changes (scroll position instead of `isOpen` state) and the initial
`y` offset is a little larger (16-24px rather than 12px) since these are
bigger, more central content blocks rather than a compact nav panel. See
`references/scroll-reveal-recipe.md` for the full adaptation.

## Frequency: how often will someone see this?

Straight from Emil Kowalski's framework, and directly relevant to which
sections get animation:

- **Seen 100+ times a day** (this app's nav, menu toggles) → minimal or no
  new animation; what's already there is enough. This skill isn't about the
  nav.
- **Seen once or occasionally per session** (a marketing page's content
  sections, scrolled past once per visit) → this is where a scroll reveal
  earns its place. `WhyWeExist`, `HomeSolution`, and hero content all fall
  here.
- **Marketing vs. product**: this is a marketing/storytelling site, not a
  dense product UI — so slightly more expressive, slightly longer durations
  are acceptable here than they would be in, say, a settings panel. That
  said, "slightly more expressive" still means hundreds of milliseconds, not
  seconds, and still means transform/opacity only (see Performance below).

## Performance

Only animate `transform` and `opacity`. Every animation in this skill
(fade-up via `y`/`opacity`, scale-in via `scale`) already satisfies this —
don't extend the pattern to animate `height`, `width`, `margin`, or
`padding`, which force layout recalculation on every frame instead of
running on the compositor. The one accepted exception already in this
codebase is Framer Motion's `height: isOpen ? "auto" : 0` in `MegaMenu.tsx`'s
disclosure panel — that's a deliberate, existing tradeoff for a
React-state-driven toggle, not license to animate layout properties in a
new scroll-reveal.

## Purpose over decoration

Before adding an animation, name what it's for: guiding attention to a
headline as it enters view, giving a static image a sense of depth, signaling
that scrolling revealed new content rather than it just appearing. If you
can't articulate the purpose in one sentence, it's decoration, not motion
design — reconsider whether the section actually needs it. A page section
does not need animation just because it's currently static; plenty of
content (short UI labels, already-animated hero backgrounds) is fine as-is.
