# Wiring a new message namespace (pattern 1), step by step

Adding translated UI-chrome strings via the message-namespace system touches
more files than it looks like at first. Missing one step compiles fine and
fails silently or at runtime, since there's no type-checking on message
shape in this app. Follow all of these, in order, for a **new** namespace:

1. Create `messages/<namespace>/en.json` and `messages/<namespace>/fr.json`
   with matching key structure — every key in one must exist in the other.
2. Create `messages/<namespace>/index.ts`:
   ```ts
   import en from "./en.json";
   import fr from "./fr.json";
   export const <namespace>Translations = { en, fr };
   ```
3. Import and register it in **both** `messages/en.ts` and `messages/fr.ts`
   — add the import, add it to the exported `messages` object, in both
   files. These two files are hand-maintained parallel lists, not generated;
   forgetting one means the namespace silently doesn't exist for that locale
   at runtime (next-intl will report missing messages).
4. Consume it in the component with `getTranslations("<namespace>")` (server)
   or `useTranslations("<namespace>")` (client), matching whichever the
   component already is.

If you're **adding keys to an existing namespace** instead, you only need
step 1 (both locale JSON files, matching keys) — the index/aggregator wiring
already exists.

## Verifying without type-checking

Since there's no `next-intl` TypeScript augmentation in this project, a
missing or mistyped key won't be caught by `tsc` or the editor — next-intl
resolves it at render time and falls back to displaying the raw key path,
which is easy to miss in a quick visual check if you're not looking for it.
After adding or changing keys:
- Re-read both JSON files side by side and confirm identical key structure
  (same nesting, same key names, only the string values differ).
- Re-read the component's `t("...")` / `t.rich("...")` calls and confirm
  every key path used actually exists in the namespace you registered it
  under.
- If you have a way to actually render the page (a dev server, a browser
  tool), check both locales — a raw key path showing up as visible text is
  the signature of a wiring mistake.

## The `(home)` namespace trap

`messages/(home)/en.json` and `messages/(home)/fr.json` still contain the
literal `create-next-app` placeholder copy ("To get started, edit the
page.tsx file...", and its French translation of the same placeholder). This
namespace is wired all the way through (`index.ts`, registered in
`messages/en.ts`/`fr.ts` as the `home` key) but **nothing renders it** — the
real homepage (`app/[locale]/page.tsx`) renders `HomeHero` and `WhyWeExist`,
which get their content from `home-hero/data.ts` via the pattern-2 system
entirely separately. If a task mentions "the home page's copy" or "the
homepage translations," don't assume it means this namespace just because
the name matches — trace what the actual rendered page imports before
editing. This is the single easiest mistake to make in this app's i18n setup
precisely because the namespace looks legitimate (fully wired, valid JSON,
plausible key names) while being completely disconnected from what ships.

## Keeping both locales in lockstep

Whichever pattern you're using, treat "both languages, together" as a single
atomic unit of work:
- Pattern 1: never merge/commit a key added to `en.json` without the
  matching key (even as a first-draft translation) in `fr.json`.
- Pattern 2: never add a field to a `data.ts` object with only an `en` value
  and a placeholder/missing `fr` — `LocalizedText` requires both, and
  TypeScript will actually catch a fully-missing `fr` key here (unlike
  pattern 1's JSON, `LocalizedText` is a real interface), but it won't catch
  a lazy placeholder like `fr: "TODO"` — that's on you to actually fill in
  or clearly flag as an unreviewed draft in your report.
