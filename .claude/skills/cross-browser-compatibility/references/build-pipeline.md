# Build pipeline: what's already handled for you

This file explains *why* the target matrix is what it is and what Lightning
CSS/Turbopack already does automatically, so you don't duplicate work the
build tool does for free. Re-verify the source docs
(`node_modules/next/dist/docs/03-architecture/supported-browsers.md` and
`node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/useLightningcss.md`)
if this file feels stale — Next.js bundler defaults change between major
versions, and this project (Next 16.2.9) is newer than a lot of training
data.

## The default target matrix

With no `browserslist` key in `package.json` (checked: there isn't one),
Next.js 16 defaults to:

```json
{ "browserslist": ["chrome 111", "edge 111", "firefox 111", "safari 16.4"] }
```

That's the floor. Anything supported by all four of those engines needs no
special handling at all. Anything supported by *some* but not all of them
gets transpiled/prefixed automatically by Lightning CSS as long as it's a
CSS-level feature Lightning CSS knows how to transform (see the feature list
below) — you don't need to hand-write a fallback.

## Turbopack + Lightning CSS

`package.json`'s `dev`/`build` scripts are plain `next dev`/`next build` with
no `--webpack` flag, and per Next 16's upgrade notes, **Turbopack is the
default bundler for both** as of this major version. Turbopack always uses
Lightning CSS for CSS processing — this is not configurable via
`experimental.useLightningcss` (that flag only affects webpack builds; it's
ignored under Turbopack, which uses Lightning CSS unconditionally). Tailwind
v4's own `@tailwindcss/postcss` plugin (configured in `postcss.config.mjs`)
still runs to expand `@import "tailwindcss"` and generate utility classes;
Lightning CSS then processes the resulting CSS for the target matrix,
including vendor prefixing and syntax transpilation.

Practical effect: this project doesn't need (and doesn't have) `autoprefixer`
in its PostCSS config. Its absence is not a gap — it's redundant with what
Lightning CSS already does. You can see the result directly in compiled
output: `.backdrop-blur-[3px]` ships with `-webkit-backdrop-filter`
automatically, and Tailwind's `color-mix()`/`oklab()`-based color utilities
are wrapped in `@supports (color: color-mix(in lab, red, red))` with a plain
hex fallback outside it, generated without anyone writing that by hand.

## What Lightning CSS auto-transpiles (by target)

Lightning CSS decides what to transpile/prefix based on the browserslist
target. Its `lightningCssFeatures` option (configurable, not currently set in
this project's `next.config.ts`) can force-include or force-exclude specific
features, but by default it just does the right thing for the configured
targets. The feature set it's aware of includes: CSS nesting, `:is()`,
`:not()` with lists, `:dir()`, `:lang()` with lists, text-decoration
percentage values, modern media query syntax (range/interval syntax,
`@custom-media`), `clamp()`, `color()`, `oklab()`/`oklch()`, `lab()`/`lch()`,
P3 colors, 4/8-digit hex alpha, space-separated color notation,
`system-ui`, double-position gradients, vendor prefixes generally, logical
properties, and `light-dark()`. If a component uses any of these, don't
manually rewrite it for compatibility — it's handled.

## What is *not* auto-transpiled

Not everything CSS can be polyfilled by rewriting syntax. Notably:

- **`@property`** (CSS Houdini custom property registration) is not in
  Lightning CSS's transpilable feature list — there's no equivalent fallback
  syntax to rewrite it to. Tailwind v4's generated CSS uses `@property` rules
  internally (for `--tw-translate-x`, `--tw-border-style`,
  `--tw-gradient-from`, and similar) so that transitions/animations on those
  internal state variables behave correctly. Browsers that don't support
  `@property` simply ignore the at-rule — the underlying custom property and
  its plain value still work, so layout and static styling are unaffected;
  the only loss is smoother animation of those specific internal variables in
  edge cases. `@property` shipped in Safari 16.4 (exactly this app's floor)
  and Chrome/Edge well before their 111+ floor. Firefox is the one to
  double-check if this ever matters in practice — confirm current support at
  caniuse.com rather than trusting a fixed version number here, since Firefox
  support for this landed later than Chrome/Safari and this note may age.
  In practice, by the time you're reading this, Firefox's evergreen
  auto-update means almost no real users are on a Firefox old enough for this
  to matter — treat it as a "know why it's not a real bug" item, not an
  action item, unless you have evidence otherwise.
- **Runtime JavaScript behavior** — animation timing, focus management,
  event handling quirks. No CSS transpiler touches this; see
  `references/animation-and-fonts.md` and `references/triage-and-testing.md`.
- **Font file format support** — Lightning CSS doesn't generate or choose
  font files for you; a missing `.woff2` fallback is a content/asset gap, not
  a CSS syntax gap. See `references/animation-and-fonts.md`.

## If the pipeline configuration changes

If you ever find `next.config.ts` has gained a `--webpack` opt-out, an
`experimental.useLightningcss` override, or a `lightningCssFeatures`
include/exclude list, or `package.json` has gained a `browserslist` key —
stop and re-read the actual current values before relying on anything in
this file. Those changes mean a different (possibly older, possibly newer)
set of browsers is being targeted, and everything above about "already
handled" needs to be re-verified against the new target, not assumed.
