# Decisions log — internationalize-components

Read this before starting a run of this skill; append to it when you finish
(see Step 4 in SKILL.md). Entries are terse: situation, decision, why, which
file(s). If the same kind of entry shows up three or more times, it should
graduate into SKILL.md or a reference doc instead of staying here.

## 2026-07-12 — Home page sections + legal pages pass

- **HomeBlog's `BlogPost.date` field** was a plain hardcoded English string
  (`date: string`) sitting inside an object whose other fields (`title`,
  `excerpt`) were already `LocalizedText`. Easy to miss precisely because
  the neighboring fields already looked correctly localized. Converted
  `date` to `LocalizedText`, drafted French date formatting ("Jun 13, 2026"
  → "13 juin 2026"), flagged for native review. Now written up as a Step 1
  checklist item: check every sibling string around a translated value.
- **LegalPageLayout's "Last updated:" label** was hardcoded English right
  next to an already-translated `lastUpdated` date value. Added a
  `lastUpdatedLabel` key to both `termsOfUse`/`privacyPolicy` message
  namespaces (en + fr), threaded through `page.tsx` → `LegalPageLayout`.
  Same root cause as the blog-date case above — a label immediately
  adjacent to translated content.
