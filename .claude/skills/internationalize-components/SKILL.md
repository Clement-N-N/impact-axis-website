---
name: internationalize-components
description: Internationalize a specific component in this next-intl (en/fr) Next.js app — replace hardcoded strings with the correct existing pattern (next-intl message namespaces, or the LocalizedText/getLocalizedText data pattern), wire locale-aware navigation, and account for French text running longer than English — all without altering existing layout structure, className logic, or GSAP/Framer Motion animation beyond what's strictly needed to keep both locales looking right. Trigger whenever asked to "internationalize X", "add French to X", "make X translatable", "this component is English-only", or "add i18n to X". This app already has two distinct, deliberate content patterns (flat UI-chrome messages vs. structured per-locale content objects) plus an established convention for locale-aware layout (locale-keyed cva variants) — the skill's job is picking the right existing pattern for the component at hand, not inventing a third one.
---

# Internationalizing components

This app is bilingual (`en`/`fr`, via `next-intl`, defined in `i18n/routing.ts`)
and already has real, working conventions for this — the job is almost never
"add i18n from scratch," it's "extend the existing system correctly for this
one component." Getting the wrong pattern for the wrong kind of component is
the main failure mode: this codebase deliberately uses **two different**
systems for translatable content, plus a **third** established convention
for keeping layout intact when French text is longer than English. Mixing
them up (e.g. inventing a new flat message key for what should be structured
content, or forgetting that French routinely runs 15-20% longer and will
wrap differently) is how you'd "internationalize" something while quietly
breaking its layout — exactly what this skill needs to avoid.

## Step 0 — Learn the two content systems and the layout convention

Also check whether `references/decisions-log.md` exists in this skill's
folder and read it before starting — it holds judgment calls from past runs
of this skill on this specific codebase that are worth knowing before
re-deriving the same call from scratch. See Step 4 for how to add to it.

Read `references/content-patterns.md` before touching anything. In short:

1. **`next-intl` message namespaces** (`messages/<namespace>/{en,fr}.json`
   + `useTranslations`/`getTranslations`) — for flat, short UI-chrome strings:
   nav labels, button text, page titles, taglines. This is what
   `Navbar.tsx`, `MobileNav.tsx`, `MegaMenu.tsx`, and every route's
   `page.tsx` currently use.
2. **`LocalizedText` objects + `getLocalizedText`** (defined in
   `components/sections/home-hero/types.ts`, reused by
   `components/sections/why-we-exist/WhyWeExist.tsx`) — for structured,
   content-managed marketing copy that lives in a typed `data.ts` file
   alongside the component: hero headlines, rich segmented text
   (`headlineSegments` mixing plain text, emphasis, and icon/image chips),
   card copy, CTAs. This is what every `home-hero` variant and `WhyWeExist`
   use.

Pick based on what the component already looks like, not on habit: a small
reusable UI piece with a handful of short strings wants pattern 1; a
content-driven page section with copy that a content editor would think of
as "the page's actual words" (headlines, body paragraphs, structured rich
text) wants pattern 2. If the component already receives a `locale` prop and
sits next to a `data.ts`/`types.ts` pair, it's already pattern 2 — extend
that, don't introduce `useTranslations` alongside it.

Read `references/layout-and-animation-safety.md` for the third convention:
this codebase already handles "French is longer" by giving locale-sensitive
width/span classes their own `cva` variant keyed by `locale` (see
`MegaMenu.tsx`'s `imageColSpanStyles`/`itemsColSpanStyles` — French gets
`lg:col-span-9` where English gets `lg:col-span-8`, precisely because the nav
labels are longer in French). Several hero components even scaffold an
identical-today `cva({ variants: { locale: {...} } })` on purpose, so the
seam already exists if a real difference shows up later. This is the
mechanism for satisfying "don't break existing styles" while still being
honest that a different language is a different length — extend this pattern
rather than hardcoding one language's proportions and hoping the other fits.

## Step 1 — Read the target completely

- Is it a server component (`page.tsx`, no `"use client"`) or client
  component? Server components fetch translations with `await getTranslations(...)`
  from `next-intl/server`; client components use the `useTranslations()` /
  `useLocale()` hooks from `next-intl`. Match whichever this component
  already is — don't add `"use client"` just to use a hook if a server-side
  call would do.
- Does it already receive a `locale` prop from a parent (the pattern-2
  chain: `page.tsx` → section → variant, e.g. `app/[locale]/page.tsx` →
  `HomeHero` → `PromoCardHero`)? If so, thread `locale` the same way rather
  than reaching for `useLocale()` independently partway down the tree.
- What hardcoded strings actually exist — visible text, `alt` text,
  `aria-label`/`title` attributes, and anything passed as a string prop to a
  child that will render it. All of these need translating, not just the
  obviously "content" ones.
- Any internal links (`href="/blog"`, `href="/programs"`, etc.)? Check
  whether they already use `Link` from `@/i18n/navigation` (locale-aware,
  auto-prefixes the current locale) rather than plain `next/link` — see
  `references/content-patterns.md` for why this matters.
- Any GSAP/Framer Motion logic that measures, positions, or times itself
  based on the rendered text (e.g. anything reading `element.offsetWidth`,
  animating a chip sized to fit specific words, or timing a reveal based on
  line count)? Longer French text can change wrapping and measurements —
  read `references/layout-and-animation-safety.md` before touching these.
- Look specifically at the text/labels sitting *immediately next to* an
  already-translated field, not just the field's own value — a hardcoded
  label or prefix beside a `LocalizedText` value is easy to miss because the
  value right next to it already looks localized. Two real examples: a
  `BlogPost.date` field that was a plain hardcoded English string even
  though `title`/`excerpt` on the same object were already `LocalizedText`;
  and a "Last updated: " label hardcoded in JSX immediately before an
  already-translated `lastUpdated` date value on the legal pages. Check
  every sibling string around a translated value, not just the value.

## Step 2 — Do the work

### Adding to the message-namespace system (pattern 1)
Read `references/wiring-and-verification.md` for the exact multi-file wiring
this requires — it's mechanical but easy to get half-right (e.g. adding a
key to `en.json` but forgetting `fr.json`, or forgetting to re-export through
`messages/en.ts`/`messages/fr.ts`). There's no TypeScript type-checking on
message keys in this app (no `next-intl` type augmentation is set up), so a
missing key won't be caught until runtime — verify manually rather than
trusting the compiler.

### Adding to the LocalizedText/data.ts system (pattern 2)
Add the new field to the component's `types.ts` as `LocalizedText` (or a
richer shape if it's structured content like `headlineSegments`), populate
both `en` and `fr` in `data.ts`, and read it in the component with
`getLocalizedText(data.field, locale)` — import that helper from
`@/components/sections/home-hero/types`, the existing canonical source, even
from an unrelated section (that's what `WhyWeExist.tsx` already does; don't
redefine a second `LocalizedText` type).

### Drafting the French copy itself
Producing a reasonable French translation from the English source is
something you can and should do directly — translation quality is not the
same kind of unknowable-without-context problem as, say, writing alt text
for a photo you can't interpret. Match the register and phrasing style of
the neighboring French strings already in the same file (this app's existing
French is fairly formal, direct marketing copy, third person — not
colloquial or `tu`-form). That said, **flag your draft translation for a
native/fluent French reviewer before it ships** — tone, idiom, and
region-appropriate phrasing (this org's audience is Francophone Africa, not
necessarily metropolitan France) are exactly the kind of judgment call worth
a second set of eyes, even though drafting it yourself is reasonable.

### Navigation
Use `Link`, `usePathname`, `useRouter`, `redirect` from `@/i18n/navigation`
— never `next/link` or `next/navigation` directly — for anything that needs
to stay locale-aware (internal links, programmatic navigation, reading the
current path for a locale switcher like `components/layout/LanguageSwitcher.tsx`).
The wrapped versions automatically handle locale-prefixing; the raw Next.js
versions don't know locales exist.

### Rich/embedded text
If a translated string needs embedded formatting (bold, a link, an icon)
rather than being pure plain text, use next-intl's ICU rich-text syntax in
the message JSON (`<tag>...</tag>` placeholders — the scaffolded-but-unused
`messages/(home)/en.json` shows the syntax: `<templates>Templates</templates>`)
and render it with `t.rich("key", { tag: (chunks) => <Tag>{chunks}</Tag> })`
rather than `t("key")`. Nothing in this codebase currently calls `t.rich()`
yet, so you won't find a live example to copy — follow next-intl's current
documented API for it rather than improvising a string-concatenation
workaround, which would break if the tag needs to move for grammatical
reasons in French.

## Step 3 — What to flag instead of guessing

- **The translation itself**, per Step 2 — draft it, but flag for review.
- **Any fixed-width/fixed-span container holding translated text that isn't
  already wrapped in a locale-keyed `cva`/`clsx` variant.** Don't silently
  assume French will fit; either extend the locale-variant convention with a
  best-effort adjustment and flag it as an estimate, or flag the container
  without guessing at new width numbers if you can't reason about how much
  extra room is actually needed.
- **Any GSAP/Framer Motion code whose timing or positioning depends on
  measuring rendered text** — a code-only read can't tell you whether French
  wrapping breaks the animation; flag it for a human to check both locales
  visually (this is the same "can't verify without rendering" situation the
  `cross-browser-compatibility` and `responsive-components` skills run into).
- **The `messages/(home)/` namespace specifically** — it's leftover
  create-next-app placeholder content, disconnected from the real homepage
  (which is `HomeHero`/`WhyWeExist` off `data.ts`). If a task seems to want
  you to edit "the home page's translations," confirm which system is
  actually rendering the content in question before editing — don't assume
  a same-named message namespace is the live source.

## Step 4 — Log new judgment calls for next time

If you made any judgment call, hit any ambiguity, or found any new pattern
in this run that isn't already covered by this skill or its reference docs,
append a short dated entry to `references/decisions-log.md` (create the
file if it doesn't exist). Keep entries terse — the situation, what you
decided and why, and which file(s) it applied to. This is how the skill
gets sharper and more tailored to this specific project over repeated use.
If the same kind of entry shows up three or more times, that's a signal it
should graduate from the log into the main skill instructions — mention
this in your report if you spot it.

## Step 5 — Report back

For each component: which pattern you used and why it matched the existing
convention; every string you translated, with the French flagged as a draft
needing review; any layout adjustment you made or flagged for long-French
overflow, and why; any animation you flagged as needing a visual check in
both locales; and confirmation that both `en` and `fr` sources were updated
in lockstep (never ship a key in one locale file without the other). Run
`npx prettier --write <file>` on anything you touch.

## Never

- Don't invent a third content pattern — pick between the two that already
  exist (Step 0).
- Don't add a message key to only one locale file, or only one language's
  field in a `LocalizedText` object — always both, together.
- Don't use raw `next/link`/`next/navigation` for anything that needs to
  respect the current locale.
- Don't restructure a component's JSX, class names, or animation logic
  beyond what's needed to (a) render translated text and (b) accommodate
  length differences via the locale-`cva` convention. This skill exists to
  add translation, not to redesign the component.
- Don't touch components you weren't asked about, even to fix something you
  notice in passing — mention it in the report instead.
