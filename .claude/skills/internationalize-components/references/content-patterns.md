# The two content systems, and which one to use

## Pattern 1: next-intl message namespaces

Structure: `messages/<namespace>/en.json` + `messages/<namespace>/fr.json`,
combined by `messages/<namespace>/index.ts` into a `{ en, fr }` export, then
re-exported through the top-level `messages/en.ts` / `messages/fr.ts` files
that `i18n/request.ts` actually loads at request time. Namespaces today:
`nav`, `home`, `about`, `whatWeDo`, `workWithUs`, `programs`, `blog`,
`impact` — mostly one per route.

Consumed with:
```tsx
// Server component (page.tsx files)
const t = await getTranslations("about");
t("title")

// Client component ("use client")
const t = useTranslations("nav");
t("cta")
```

This is the right choice for short, flat, UI-chrome strings: navigation
labels, button text, page titles, taglines, aria-labels for generic controls.
Real example, `messages/nav/en.json`:
```json
{
  "links": { "home": "Home", "about": "About Us", ... },
  "megaMenu": { "items": { "partners": "Partners & Institutions", ... }, "tagline": "..." },
  "cta": "Get in touch"
}
```

**No compile-time safety.** This app has not set up next-intl's optional
TypeScript augmentation (there's no `declare module 'next-intl'` anywhere),
so `t("some.key")` is not type-checked against the actual JSON shape. A typo
or a missing key fails at runtime (next-intl logs a warning and renders the
key path as fallback text), not at build time. Always double check the exact
key path exists in **both** `en.json` and `fr.json` after adding one.

## Pattern 2: LocalizedText + getLocalizedText

Defined once in `components/sections/home-hero/types.ts`:
```tsx
export type LocalizedText = { en: string; fr: string };
export function getLocalizedText(text: LocalizedText, locale: Locale): string {
  return text[locale];
}
```

Used for structured, content-managed copy that lives in a typed `data.ts`
next to the component, not in a JSON message file. Every `home-hero` variant
and `components/sections/why-we-exist/WhyWeExist.tsx` use this. The
`fullbleed-overlay` hero variant shows why this exists instead of flat
messages: its `headlineSegments` field is an *array* of mixed segments (plain
text, emphasized text, icon chips, image chips) per locale — that's not
expressible as a single translated string, it needs real structure:
```tsx
headlineSegments: Record<Locale, HeadlineSegment[]>
```

**Reuse the existing `LocalizedText` type and `getLocalizedText` helper by
importing from `home-hero/types.ts`, even from an unrelated section.**
`WhyWeExist.tsx` already does this (`import { getLocalizedText } from
"@/components/sections/home-hero/types"`). Defining a second, parallel
`LocalizedText` type would fragment the pattern for no benefit — the
existing one has no hero-specific coupling despite living in that folder.

**How locale reaches the component**: pattern-2 components receive `locale`
as an explicit prop threaded down from a server component, not via a hook —
`app/[locale]/page.tsx` reads `params.locale`, passes it to `HomeHero`, which
passes it to whichever hero variant is active, which calls
`getLocalizedText(field, locale)`. If you're extending a component already
in this chain, keep threading the prop the same way rather than introducing
`useLocale()` partway down — that would create two different ways of
knowing the current locale in the same render tree for no reason.

## Choosing between them for a new component

Ask: would a content editor think of this as "the page's actual words" (a
data/content concern) or "the app's interface chrome" (a UI/labels concern)?
Headlines, body copy, card content, anything with rich/segmented structure →
pattern 2. Button labels, nav items, generic short UI strings, page
titles/meta → pattern 1. If the component already has a `data.ts`/`types.ts`
pair and a `locale` prop, it's already pattern 2 — extend it. If it already
calls `useTranslations`/`getTranslations`, it's already pattern 1 — add keys
to its existing namespace (or a new one, following
`references/wiring-and-verification.md`).

## A third, smaller pattern: inline ternaries — use sparingly, and know why

`components/layout/MegaMenu.tsx` has at least one hardcoded inline ternary
instead of either system:
```tsx
alt={locale === "fr" ? "Image du menu" : "Menu image"}
```
This works, and for a single, truly one-off string with no reuse and no
content-management need, it's a defensible shortcut — not everything needs
full pattern-1/pattern-2 ceremony. But don't reach for this as your default:
it doesn't get picked up by any translation-management tooling, doesn't
share phrasing with anything else, and is easy to forget when auditing what's
translated. Prefer pattern 1 or 2 whenever the string is user-facing content
of any real substance; reserve inline ternaries for genuinely trivial,
truly-only-used-once strings like this one.

## Internal links must use the locale-aware navigation helpers

`i18n/navigation.ts` wraps Next's navigation APIs:
```tsx
export const { Link, redirect, usePathname, useRouter, permanentRedirect } =
  createNavigation(routing);
```
Every internal `<Link>`, `usePathname()`, `useRouter()` call in this app
should import from `@/i18n/navigation`, not `next/link`/`next/navigation`
directly — the wrapped versions know about `routing.locales` and
automatically prefix hrefs with the current locale (or the target locale, if
you pass one explicitly, as `components/layout/LanguageSwitcher.tsx` does to
build the "switch language, stay on this page" link). Raw Next.js navigation
APIs have no concept of locale and will silently produce non-locale-aware
links if used by mistake.
