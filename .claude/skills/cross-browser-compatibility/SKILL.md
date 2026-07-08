---
name: cross-browser-compatibility
description: Review or fix a specific component/page section in this Next.js 16 + Turbopack + Tailwind v4 app for cross-browser rendering and behavior differences (Chrome, Edge, Firefox, Safari — desktop and iOS). Trigger whenever asked to "check X for cross-browser issues", "make X work on Safari/Firefox", "fix this on iOS", "this looks broken in [browser]", or when reviewing a component with custom viewport-height sizing, sticky positioning, GSAP/Framer Motion animation, custom @font-face, or hand-authored CSS/SCSS. Deliberately research-heavy: this app's build pipeline (Turbopack's Lightning CSS) already auto-prefixes and transpiles most standard CSS for its target browsers, so the skill's real job is catching the things the build tool can't fix — JS-driven animation behavior, viewport-unit bugs on mobile Safari, font-loading fallbacks, and anything that needs real-browser verification rather than code review. Always re-checks current Next.js/Tailwind behavior against node_modules/next/dist/docs before assuming anything, since AGENTS.md warns this app runs a newer Next.js than most training data covers.
---

# Cross-browser compatibility

The single most important fact about this codebase's cross-browser posture:
**most classic "add vendor prefixes" work is already done for you.** This app
runs Next.js 16 with Turbopack (the default for both `next dev` and
`next build` here — no `--webpack` flag in `package.json`), and Turbopack
always uses Lightning CSS for its CSS pipeline, regardless of the project's
own `postcss.config.mjs` (which only configures `@tailwindcss/postcss`, no
`autoprefixer` — that's fine, it's not needed). Lightning CSS reads the
project's Browserslist target (this project has none configured, so it falls
back to Next's own default: **Chrome 111+, Edge 111+, Firefox 111+, Safari
16.4+**) and automatically adds vendor prefixes and transpiles unsupported
CSS syntax for that target. You can already see this working in the compiled
output — Tailwind's `backdrop-blur-*` utility ships with `-webkit-backdrop-filter`
automatically, and modern `color-mix()`/`oklab()` color values are wrapped in
an `@supports` block with a plain-hex fallback for browsers that don't
understand them.

That means don't spend effort manually adding `-webkit-`/`-moz-` prefixes to
Tailwind-generated utility classes or standard CSS properties — the build
already does it for the configured target browsers. Focus instead on the
things no build tool can fix: **runtime JavaScript/animation behavior,
viewport-unit quirks on real mobile devices, font-loading fallbacks, and
anything you can't verify just by reading code.**

This app runs a Next.js version newer than most training data (`AGENTS.md`
says exactly this: read `node_modules/next/dist/docs/` before assuming
anything). This skill leans on that instruction harder than the other two
skills in this app, because browser-support behavior is one of the things
Next.js changes between major versions (Turbopack becoming default, its CSS
engine, its polyfill strategy). Don't rely on general Next.js knowledge from
training — verify against the actual docs shipped in this `node_modules`
before making claims in your report.

## Step 0 — Confirm the current build pipeline and target matrix

Before touching a component, re-verify (things change; don't trust cached
assumptions from a previous run of this skill):
1. Read `node_modules/next/dist/docs/03-architecture/supported-browsers.md`
   for the current default target matrix and polyfill behavior.
2. Check `package.json` for a `"browserslist"` key and `next.config.ts` for
   `experimental.useLightningcss` / `lightningCssFeatures` — if either is
   set, the target matrix or transpilation behavior differs from the
   defaults described in `references/build-pipeline.md`.
3. Check whether `package.json`'s `dev`/`build` scripts pass `--webpack` —
   if so, this project has opted out of Turbopack and the CSS pipeline is
   PostCSS + `postcss-preset-env` instead of Lightning CSS, which changes
   which features get auto-transpiled.

`references/build-pipeline.md` has the full detail on what this means in
practice and what's already handled vs. not. Read it once per session rather
than assuming it's still accurate months from now — Next.js's bundler
defaults have changed before (Turbopack itself only became the default in
Next.js 16) and will again.

## Step 1 — Read the target completely

Same as the sibling skills: read the whole component, its animation logic,
and anything it renders. Specifically look for:
- Viewport-relative sizing (`100vh`, `vh`/`vw` units, `min-h-screen`)
- `position: sticky` or `fixed`
- GSAP/Framer Motion imports, especially anything animating `clip-path`,
  `filter`, or SVG path data
- `@font-face` declarations or custom font usage
- Anything reaching for a newer/less common Web API (`ResizeObserver`,
  `IntersectionObserver`, `structuredClone`, View Transitions, `:has()`,
  container queries) — most are fine at this target matrix, but confirm
  rather than assume (see `references/build-pipeline.md`)

## Step 2 — Fix categories

### Viewport height on mobile (the biggest real bug class here)
`100vh` does not equal "the visible viewport" on mobile Safari/Chrome:
mobile browser chrome (URL bar, tab bar) can be visible or collapsed, and
`100vh` is calculated against the *largest* possible viewport, so a
`min-h-screen`/`h-screen` element can extend below what's actually visible,
causing content or backgrounds to appear cut off or leave a gap when the
browser chrome is showing. This app has two real instances today:
- `components/sections/home-hero/CollageDarkHero.tsx` — `min-h-screen` applies
  at every breakpoint including mobile (only `lg:h-[calc(100vh-var(--header-height))]`
  is breakpoint-gated; the base `min-h-screen` is not).
- `components/layout/MobileNav.tsx` — the open nav panel is inline-styled to
  `height: calc(100vh - var(--header-height))`, and this is specifically the
  *mobile* navigation panel, so it's the highest-risk instance in the app.

Fix: use the dynamic viewport unit instead — `dvh` (`100dvh`, or Tailwind's
`h-dvh`/`min-h-dvh` utilities if present in this Tailwind version — verify by
checking the compiled CSS or Tailwind's own docs, since custom utilities
aren't declared in this project's `@theme` block and rely on Tailwind's
built-in core plugins). `dvh` is supported by every browser in Next's default
target matrix (Safari 15.4+, well below the 16.4+ floor; Chrome 108+; Firefox
101+ — all older than the Chrome/Firefox 111+ floor), so this is safe to fix
directly, not just flag. For the inline style in `MobileNav.tsx`, replace
`calc(100vh - var(--header-height))` with `calc(100dvh - var(--header-height))`.

### position: sticky breaking silently
`sticky` stops working — in every browser, this is spec behavior, not a
browser bug — if any ancestor of the sticky element has a `transform`,
`filter`, `will-change: transform`, `perspective`, or `contain: layout/paint`
applied. `Navbar.tsx` and `MobileNav.tsx`'s headers are both `sticky` today,
and as of this writing nothing wraps them in a transformed ancestor, so
they're currently safe. This is a "watch, don't fix" item: if you're asked to
add a page-transition wrapper, a scroll-linked parallax container, or any
GSAP animation on a shared layout element that wraps the header, check
whether it applies a transform to an ancestor of the sticky header — if so,
the header will silently stop sticking in every browser at once, which can
be confusing to debug because it isn't browser-specific. Flag this
explicitly if you see it about to happen; it's not something to guess a fix
for without seeing the rendered result.

### Animation: GSAP/clip-path/SVG morphing
GSAP itself normalizes most cross-browser animation differences internally,
so don't assume a GSAP-driven animation needs manual per-browser handling.
The residual, real risk is compositor performance, not correctness:
`clip-path` animation (`HeroBackgroundSlideshow.tsx`'s crossfade) and
combined `borderRadius`/`rotate` loops (`HeadlineWithIcons.tsx`'s `IconChip`)
can run less smoothly on Safari than Chrome because compositors don't
hardware-accelerate every animated property identically. This isn't
something you can detect or fix by reading code — flag it for manual
visual verification in Safari specifically (see Step 3), and only make a
change if you're specifically asked to address observed jank, e.g. by adding
`will-change` hints or simplifying which properties animate.

Read `references/animation-and-fonts.md` for more detail, including how this
overlaps with the `accessible-components` skill's `prefers-reduced-motion`
work — if you're fixing a component for cross-browser animation issues, it's
worth checking whether `prefers-reduced-motion` is handled at the same time,
since a rewritten animation is disruptive to test twice.

### Fonts
`styles/_fonts.scss` declares `@font-face` for "PP Neue Montreal" with a
single `format("opentype")` source per weight/style — no `.woff2` fallback.
Raw `.otf`/`.ttf` via `@font-face` does render in every browser in this
app's target matrix, so this isn't a hard breakage, but it's worth fixing
when you touch font-loading code: `.woff2` is 30-50% smaller and is the
format every modern browser prefers, and listing it first with `.otf` as a
fallback costs nothing and is strictly safer for any browser outside the
officially supported matrix. This requires a `.woff2` file to exist
(font conversion, not something to fabricate) — if one isn't already in
`public/fonts/`, flag that a `.woff2` needs to be generated from the source
`.otf` rather than silently leaving the fix incomplete.

The generic fallback stack (`"PP Neue Montreal", ui-sans-serif, system-ui,
sans-serif` in `app/globals.css`) is already correct — don't remove it if you
touch this.

### Anything using a newer or experimental Web API
This app does not currently use the View Transitions API
(`experimental.viewTransition` is not set in `next.config.ts`), `:has()`,
or container queries anywhere. If a task asks you to add one:
- View Transitions specifically degrade gracefully per Next's own docs
  ("Without browser support, your application works normally, the
  transitions simply do not animate") — safe to use, but note in your report
  that Safari may animate differently and it's worth a manual look.
- `:has()` and container queries are supported across this app's entire
  target matrix (all shipped well before Safari 16.4/Chrome 111/Firefox 111)
  — safe to use without special fallback handling.
- For anything else new, check actual current support against the target
  matrix in `references/build-pipeline.md` rather than assuming.

## Step 3 — What you can and can't verify yourself

Read `references/triage-and-testing.md` for the full breakdown. In short:
you can verify Chrome rendering directly if a browser automation tool is
available in this session; you cannot verify Safari or Firefox rendering
that way (there's no engine-accurate emulation for WebKit/Gecko available
here). Any fix whose entire justification is "this looks different in
Safari" needs to be reported as unverified and handed to a human with real
Safari/iOS access to confirm — don't claim a visual fix works cross-browser
without a way to actually check it.

## Step 4 — Report back

For each component: what you fixed and why it's safe within the confirmed
target matrix (cite the specific browser/version floor where relevant, e.g.
"dvh is supported from Safari 15.4, below this app's 16.4+ floor"); what you
flagged instead of guessing, and specifically what a human needs to check and
in which browser; and whether anything you touched overlaps with motion
(`prefers-reduced-motion`, see `accessible-components`) or layout
(`responsive-components`) so those skills' concerns don't get missed. Run
`npx prettier --write <file>` on anything you touch.

## Never

- Don't manually add vendor prefixes to Tailwind-generated classes or
  standard CSS the build pipeline already handles — verify first (Step 0),
  don't assume it's needed just because that used to be common practice.
- Don't change the project's Browserslist/target matrix (adding one, or
  changing `next.config.ts` CSS experimental flags) without flagging it —
  that's a decision about which real users/devices the site needs to
  support, not a code-level fix.
- Don't claim a fix resolves a Safari/Firefox-specific issue without a way to
  actually verify it rendered correctly there — report it as unverified
  instead.
- Don't touch components you weren't asked about, even to fix something you
  notice in passing — mention it in the report instead.
