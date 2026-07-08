# Grid, breakpoints, and layout tokens

Everything here is the pattern as of this writing. Always confirm current
values by reading `app/globals.css` directly — this file just explains what
the numbers mean and how they fit together.

## Breakpoints (defined in `app/globals.css`, `@theme inline`)

| Prefix | Min width | Role in this app                                  |
|--------|-----------|----------------------------------------------------|
| (base) | 0         | Mobile — 4-column grid                              |
| `sm`   | 640px     | Rarely used directly for the main grid              |
| `md`   | 768px     | Tablet — 8-column grid                              |
| `lg`   | 1024px    | Desktop / "base" — 12-column grid                   |
| `xl`   | 1280px    | Desktop, wider container padding kicks in           |
| `xxl`  | 1400px    | Custom breakpoint, added on top of Tailwind's defaults |
| `2xl`  | 1536px    | Extra-large monitors — span/width refinements, not a new column count |

Note `xxl` is not a stock Tailwind breakpoint — it was added specifically for
this app (`--breakpoint-xxl: 1400px` in `globals.css`). `xl`/`xxl`/`2xl` don't
add a fifth or sixth column count; the grid stays at 12 columns from `lg`
upward. What changes at those larger sizes is usually container padding
(`CONTAINER_PADDING_CLASSES`) and, in a few hero sections, hand-tuned
`col-span`/width overrides to keep content from stretching too wide on
ultra-wide monitors. Only add `xxl`/`2xl` overrides if a fix genuinely looks
wrong at those widths — don't add them by default to every component.

## Column system

Source of truth: `components/dev/DesignGridOverlay.tsx`. Its own comment
states the convention plainly: "4 cols below `md`, 8 from `md` to `lg`, 12
from `lg` up." The house pattern for a responsive grid container is:

```
grid-cols-4 md:grid-cols-8 lg:grid-cols-12
```

Many existing hero sections currently use `grid-cols-1 ... lg:grid-cols-12`
instead — a single stacked column on everything below `lg`, with no tablet
step. That's not wrong for very simple stacks, but it means there's no real
tablet layout, and it's easy to accidentally pair with an unprefixed
`col-span-*`/`col-start-*` class that assumes 12 columns exist (see SKILL.md
Step 3 for why that's a bug, not just a gap).

## Container and gutter

`components/layout/Container.tsx` exports `CONTAINER_PADDING_CLASSES`:

```
px-6 md:px-12 lg:px-16 xl:px-container
```

`px-container` resolves to `24px` via `--spacing-container`. Gutter between
grid items is `gap-gutter`, which resolves to `16px` via `--spacing-gutter`.
Always reuse these rather than hardcoding new padding/gap values — they're
the mechanism that already keeps horizontal rhythm consistent across
breakpoints.

## Type scale

`--text-xs` through `--text-6xl` in `app/globals.css` are all defined in pure
`vw`, each paired with its own `--text-*--line-height`. They're described in
a comment as "sized so each step hits its reference px value at a 1440px
viewport" — meaning they were tuned to look like a normal type scale at
1440px and simply scale linearly with viewport width on either side of that.
See `references/typography-and-spacing.md` for why that's a problem below
~768px and how to fix it.

## Section spacing (the pattern to imitate)

`--spacing-section` and `--spacing-section-lg` are the one place in the
current codebase that already solves the "fluid but bounded" problem
correctly:

```css
--spacing-section: clamp(3rem, 2rem + 5vw, 6rem);
--spacing-section-lg: clamp(4rem, 2.5rem + 7.5vw, 10rem);
```

When a component needs a custom fluid value that also has to behave on
mobile, mirror this `clamp(min, preferred, max)` shape rather than using a
bare `vw` or `%` value.
