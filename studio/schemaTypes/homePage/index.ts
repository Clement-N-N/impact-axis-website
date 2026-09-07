import { defineArrayMember, defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";

export const HOME_PAGE_TYPE = "homePage";
export const HOME_PAGE_ID = "homePage";

/**
 * homePage — singleton document controlling all copy on the home page (/).
 *
 * This is a singleton: there is only ever one "homePage" document.
 *
 * Section guide:
 *  ── Hero ──────────── Active variant selector + copy for the collage-description variant
 *                        (the fullbleed-overlay variant uses hardcoded chip/icon segments — not editable here)
 *  ── Why We Exist ──── Eyebrow, headline, 2 paragraphs
 *  ── Solution ──────── Eyebrow, headline, 3 paragraphs, button
 *  ── What We Build ──── Overlay copy + 3 slides
 *  ── Who We Serve ───── Eyebrow + 3 audience cards
 *  ── Impact ────────── Eyebrow, paragraph, CTA label (stats come from homeImpact document)
 *  ── Bottom CTA ────── Title + button label
 */
export const homePage = defineType({
  name: HOME_PAGE_TYPE,
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "whyWeExist", title: "Why We Exist" },
    { name: "solution", title: "Solution" },
    { name: "whatWeBuild", title: "What We Build" },
    { name: "whoWeServe", title: "Who We Serve" },
    { name: "impact", title: "Our Impact" },
    { name: "bottomCta", title: "Bottom CTA" },
  ],
  fields: [
    // ─── HERO ─────────────────────────────────────────────────────────────────
    defineField({
      name: "heroActiveVariant",
      title: "Hero — Active Variant",
      type: "string",
      group: "hero",
      description: "Which hero layout to show on the homepage.",
      options: {
        list: [
          { title: "Collage + Description (recommended)", value: "collage-description" },
          { title: "Collage Dark", value: "collage-dark" },
          { title: "Overlay Welcome", value: "overlay-welcome" },
          { title: "Promo Card", value: "promo-card" },
          { title: "Full Bleed Overlay (chip segments — hardcoded)", value: "fullbleed-overlay" },
        ],
        layout: "radio",
      },
      initialValue: "collage-description",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "hero",
      description: "Used by collage-description, collage-dark, overlay-welcome, promo-card variants.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero — Description",
      type: LOCALIZED_TEXT_TYPE,
      group: "hero",
      description: "Used only by the collage-description variant.",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero — CTA Button Label",
      type: LOCALIZED_STRING_TYPE,
      group: "hero",
      description: 'e.g. "Explore our work". Links to /what-we-do.',
    }),

    // ─── WHY WE EXIST ─────────────────────────────────────────────────────────
    defineField({
      name: "wweEyebrow",
      title: "Why We Exist — Eyebrow",
      type: LOCALIZED_STRING_TYPE,
      group: "whyWeExist",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "wweHeadline",
      title: "Why We Exist — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "whyWeExist",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "wweParagraph1",
      title: "Why We Exist — Paragraph 1",
      type: LOCALIZED_TEXT_TYPE,
      group: "whyWeExist",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "wweParagraph2",
      title: "Why We Exist — Paragraph 2",
      type: LOCALIZED_TEXT_TYPE,
      group: "whyWeExist",
      validation: (Rule) => Rule.required(),
    }),

    // ─── SOLUTION ─────────────────────────────────────────────────────────────
    defineField({
      name: "solutionEyebrow",
      title: "Solution — Eyebrow",
      type: LOCALIZED_STRING_TYPE,
      group: "solution",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "solutionHeadline",
      title: "Solution — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "solution",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "solutionParagraphs",
      title: "Solution — Paragraphs",
      type: "array",
      group: "solution",
      description: "Typically 3 paragraphs shown side by side.",
      of: [
        defineArrayMember({
          type: "object",
          name: "localizedParagraph",
          fields: [
            defineField({ name: "en", title: "English", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
            defineField({ name: "fr", title: "French", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "en" } },
        }),
      ],
    }),
    defineField({
      name: "solutionButtonLabel",
      title: "Solution — Button Label",
      type: LOCALIZED_STRING_TYPE,
      group: "solution",
    }),

    // ─── WHAT WE BUILD ────────────────────────────────────────────────────────
    defineField({
      name: "wwbOverlayEyebrow",
      title: "What We Build — Overlay Eyebrow",
      type: LOCALIZED_STRING_TYPE,
      group: "whatWeBuild",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "wwbOverlayHeadline",
      title: "What We Build — Overlay Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "whatWeBuild",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "wwbSlides",
      title: "What We Build — Slides",
      type: "array",
      group: "whatWeBuild",
      description: "The 3 programme slides shown in the carousel.",
      of: [
        defineArrayMember({
          type: "object",
          name: "wwbSlide",
          fields: [
            defineField({ name: "legendLabel", title: "Legend / Tab Label", type: LOCALIZED_STRING_TYPE }),
            defineField({ name: "headline", title: "Headline", type: LOCALIZED_STRING_TYPE }),
            defineField({ name: "description", title: "Description", type: LOCALIZED_TEXT_TYPE }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
            }),
            defineField({ name: "buttonLabel", title: "Button Label", type: LOCALIZED_STRING_TYPE }),
            defineField({ name: "buttonHref", title: "Button Link", type: "string" }),
          ],
          preview: {
            select: { title: "headline.en", media: "image" },
          },
        }),
      ],
    }),

    // ─── WHO WE SERVE ─────────────────────────────────────────────────────────
    defineField({
      name: "wwsEyebrow",
      title: "Who We Serve — Eyebrow",
      type: LOCALIZED_STRING_TYPE,
      group: "whoWeServe",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "wwsCards",
      title: "Who We Serve — Audience Cards",
      type: "array",
      group: "whoWeServe",
      description: "The 3 audience cards (Young People, Funders, Employers).",
      of: [
        defineArrayMember({
          type: "object",
          name: "wwsCard",
          fields: [
            defineField({ name: "number", title: "Number", type: "string", description: 'e.g. "01"' }),
            defineField({ name: "label", title: "Label", type: LOCALIZED_STRING_TYPE }),
            defineField({ name: "description", title: "Description", type: LOCALIZED_TEXT_TYPE }),
          ],
          preview: {
            select: { title: "number", subtitle: "label.en" },
            prepare: ({ title, subtitle }) => ({ title: `Card ${title}`, subtitle }),
          },
        }),
      ],
    }),

    // ─── OUR IMPACT (chrome) ──────────────────────────────────────────────────
    defineField({
      name: "impactEyebrow",
      title: "Our Impact — Eyebrow",
      type: LOCALIZED_STRING_TYPE,
      group: "impact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "impactParagraph",
      title: "Our Impact — Paragraph",
      type: LOCALIZED_TEXT_TYPE,
      group: "impact",
      description: "Descriptive paragraph above the stat cards.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "impactReportCta",
      title: "Our Impact — Report CTA Label",
      type: LOCALIZED_STRING_TYPE,
      group: "impact",
      description: 'e.g. "Explore our impact". Links to /impact.',
    }),

    // ─── BOTTOM CTA ───────────────────────────────────────────────────────────
    defineField({
      name: "bottomCtaTitle",
      title: "Bottom CTA — Title",
      type: LOCALIZED_STRING_TYPE,
      group: "bottomCta",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bottomCtaButtonLabel",
      title: "Bottom CTA — Button Label",
      type: LOCALIZED_STRING_TYPE,
      group: "bottomCta",
      description: 'e.g. "Get in touch". Links to /contact.',
    }),
  ],
  preview: {
    select: { title: "heroHeadline.en" },
    prepare: ({ title }) => ({ title: title ?? "Home Page" }),
  },
});
