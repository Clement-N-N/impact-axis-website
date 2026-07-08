# Color contrast reference

Computed against WCAG 2.1's relative-luminance contrast formula, using the
brand colors defined in `app/globals.css` (`@theme inline`). Re-derive these
if the palette changes — this table is a snapshot, not a live source.

Thresholds: 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥19px bold)
and for non-text UI components/graphical objects (WCAG 1.4.11), e.g. icon
glyphs, focus indicators, form input borders.

| Pair | Ratio | Verdict |
|---|---|---|
| `impact-blue` (#101B62) text/bg vs. white | 15.50:1 | Comfortably passes for any use |
| `black` (#2B2B2B) text vs. white | 14.16:1 | Comfortably passes for any use |
| `impact-yellow` (#F4C600) bg vs. black text | 12.92:1 | Comfortably passes for any use |
| `impact-yellow` (#F4C600) vs. `impact-blue` (#101B62) | 9.54:1 | Comfortably passes for any use |
| `icon-purple` (#744DA9) vs. white | 6.22:1 | Passes normal text |
| `impact-gray` (#737373) vs. white | 4.74:1 | Passes normal text, barely — avoid using at small/thin weights |
| `icon-blue` (#0078D7) vs. white | 4.50:1 | Right at the normal-text threshold — fine for icons (needs only 3:1), borderline if ever used for small text |
| `icon-green` (#10893E) vs. white | 4.50:1 | Same as icon-blue — fine for icons, borderline for small text |
| `icon-peach` (#EF6950) vs. white | 3.09:1 | Fails normal-text contrast; barely clears the 3:1 non-text/large-text minimum |
| `border` (#D9D9D9) vs. white | 1.41:1 | Fine as a subtle divider; not sufficient if ever relied on as the sole indicator of an interactive boundary (e.g. a form input outline) |

## What this means in practice

`icon-peach` is currently only used as a background behind a white icon glyph
inside a small chip (`CHIP_COLOR_STYLES` in `HeadlineWithIcons.tsx`), which
is a non-text graphical object — 3.09:1 technically clears the 3:1 bar for
that use, but only just, and it would fail outright if the same color pairing
were ever used for actual text (a label, a badge with a text string instead
of an icon). If you're asked to make a component using `icon-peach` (or any
of the borderline pairs) accessible and you see it being used for real text
rather than an icon, flag it — don't silently swap the color or the text
color yourself.

If a design change would fix a borderline pair (e.g. darkening `icon-peach`
slightly, or always pairing it with black text instead of white), that's
worth including as a suggestion in your report, but the actual hex value is
a brand decision, not something to change unilaterally.

## Re-checking a new/changed color

If a component introduces a color pairing not in this table, compute it
before asserting a verdict rather than eyeballing it — contrast ratios are
frequently non-intuitive (mid-tone saturated colors especially). The formula:
relative luminance `L = 0.2126*R + 0.7152*G + 0.0722*B` on linearized
(gamma-corrected) channel values, then `(L1 + 0.05) / (L2 + 0.05)` with the
lighter color as `L1`. A quick Python one-liner or online contrast checker
both work; just don't guess.
