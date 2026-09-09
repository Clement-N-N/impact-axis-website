import { defineArrayMember, defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";

export const ABOUT_PAGE_TYPE = "aboutPage";
export const ABOUT_PAGE_ID = "aboutPage";

/**
 * aboutPage — singleton document controlling all copy on the /about page.
 *
 * This is a singleton: there is only ever one "aboutPage" document.
 * Team members and partner logos are managed as separate document lists.
 *
 * Section guide:
 *  ── Hero ─────────────── Headline, paragraph, 2 CTA buttons
 *  ── Why We Exist ──────── Eyebrow, headline, 2 paragraphs, callout quote, image caption
 *  ── Mission & Vision ──── Mission title/body + Vision title/body
 *  ── Our Approach ──────── Eyebrow, headline, subtitle, 3 steps, summary banner
 *  ── Our Story ─────────── Eyebrow, headline, photo badge, 4 paragraphs, link labels
 *  ── Our Principles ────── Eyebrow, headline, up to N principles
 *  ── Our People (chrome) ── Section labels only — people are in teamMember documents
 *  ── Partnership ───────── Eyebrow, headline, subtitle, left + right CTA banners
 */
export const aboutPage = defineType({
  name: ABOUT_PAGE_TYPE,
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "whyWeExist", title: "Why We Exist" },
    { name: "missionVision", title: "Mission & Vision" },
    { name: "ourApproach", title: "Our Approach" },
    { name: "ourStory", title: "Our Story" },
    { name: "ourPrinciples", title: "Our Principles" },
    { name: "ourPeople", title: "Our People" },
    { name: "partnership", title: "Partnership" },
  ],
  fields: [
    // ─── HERO ─────────────────────────────────────────────────────────────────
    defineField({
      name: "heroHeadline",
      title: "Hero — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroParagraph",
      title: "Hero — Paragraph",
      type: LOCALIZED_TEXT_TYPE,
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroCtaPartner",
      title: "Hero — Primary CTA Label",
      type: LOCALIZED_STRING_TYPE,
      description: 'e.g. "Partner with us". Links to /partner.',
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroCtaStory",
      title: "Hero — Secondary CTA Label",
      type: LOCALIZED_STRING_TYPE,
      description: 'e.g. "Learn our story". Scrolls to Our Story section.',
      group: "hero",
      validation: (Rule) => Rule.required(),
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
    defineField({
      name: "wweCallout",
      title: "Why We Exist — Callout Quote",
      type: LOCALIZED_TEXT_TYPE,
      description: "The highlighted pull-quote below the two paragraphs.",
      group: "whyWeExist",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "wweImageCaptionHeader",
      title: "Why We Exist — Image Caption Header",
      type: LOCALIZED_STRING_TYPE,
      group: "whyWeExist",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "wweImageCaptionBody",
      title: "Why We Exist — Image Caption Body",
      type: LOCALIZED_STRING_TYPE,
      group: "whyWeExist",
      validation: (Rule) => Rule.required(),
    }),

    // ─── MISSION & VISION ─────────────────────────────────────────────────────
    defineField({
      name: "missionTitle",
      title: "Mission — Title",
      type: LOCALIZED_STRING_TYPE,
      group: "missionVision",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "missionBody",
      title: "Mission — Body",
      type: LOCALIZED_TEXT_TYPE,
      group: "missionVision",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "visionTitle",
      title: "Vision — Title",
      type: LOCALIZED_STRING_TYPE,
      group: "missionVision",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "visionBody",
      title: "Vision — Body",
      type: LOCALIZED_TEXT_TYPE,
      group: "missionVision",
      validation: (Rule) => Rule.required(),
    }),

    // ─── OUR APPROACH ─────────────────────────────────────────────────────────
    defineField({
      name: "approachEyebrow",
      title: "Our Approach — Eyebrow",
      type: LOCALIZED_STRING_TYPE,
      group: "ourApproach",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approachHeadline",
      title: "Our Approach — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "ourApproach",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approachSubtitle",
      title: "Our Approach — Subtitle",
      type: LOCALIZED_TEXT_TYPE,
      group: "ourApproach",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approachSteps",
      title: "Our Approach — Steps",
      type: "array",
      group: "ourApproach",
      description: "The 3 Learn / Apply / Connect steps.",
      of: [
        defineArrayMember({
          type: "object",
          name: "approachStep",
          fields: [
            defineField({ name: "stepNumber", title: "Step Number", type: "string", description: 'e.g. "01"' }),
            defineField({ name: "title", title: "Title", type: LOCALIZED_STRING_TYPE }),
            defineField({ name: "subtitle", title: "Subtitle", type: LOCALIZED_STRING_TYPE }),
            defineField({ name: "description", title: "Description", type: LOCALIZED_TEXT_TYPE }),
          ],
          preview: {
            select: { title: "stepNumber", subtitle: "title.en" },
            prepare: ({ title, subtitle }) => ({ title: `Step ${title}`, subtitle }),
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "approachSummaryBanner",
      title: "Our Approach — Summary Banner",
      type: LOCALIZED_TEXT_TYPE,
      group: "ourApproach",
      description: "The highlighted line that appears below all steps.",
      validation: (Rule) => Rule.required(),
    }),

    // ─── OUR STORY ────────────────────────────────────────────────────────────
    defineField({
      name: "storyEyebrow",
      title: "Our Story — Eyebrow",
      type: LOCALIZED_STRING_TYPE,
      group: "ourStory",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "storyHeadline",
      title: "Our Story — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "ourStory",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "storyPhotoBadgeTag",
      title: "Our Story — Photo Badge Tag",
      type: LOCALIZED_STRING_TYPE,
      group: "ourStory",
      description: 'e.g. "Origins · Yaoundé"',
    }),
    defineField({
      name: "storyPhotoBadgeCaption",
      title: "Our Story — Photo Badge Caption",
      type: LOCALIZED_STRING_TYPE,
      group: "ourStory",
    }),
    defineField({ name: "storyParagraph1", title: "Our Story — Paragraph 1", type: LOCALIZED_TEXT_TYPE, group: "ourStory", validation: (Rule) => Rule.required() }),
    defineField({ name: "storyParagraph2", title: "Our Story — Paragraph 2", type: LOCALIZED_TEXT_TYPE, group: "ourStory", validation: (Rule) => Rule.required() }),
    defineField({ name: "storyParagraph3", title: "Our Story — Paragraph 3", type: LOCALIZED_TEXT_TYPE, group: "ourStory", validation: (Rule) => Rule.required() }),
    defineField({ name: "storyParagraph4", title: "Our Story — Paragraph 4", type: LOCALIZED_TEXT_TYPE, group: "ourStory", validation: (Rule) => Rule.required() }),
    defineField({
      name: "storyTimelineBadge",
      title: "Our Story — Journey Link Badge",
      type: LOCALIZED_STRING_TYPE,
      group: "ourStory",
      description: 'Small badge label on the link to /about/journey, e.g. "Our Journey".',
    }),
    defineField({
      name: "storyTimelineText",
      title: "Our Story — Journey Link Text",
      type: LOCALIZED_STRING_TYPE,
      group: "ourStory",
      description: 'Link text, e.g. "Read our journey".',
    }),

    // ─── OUR PRINCIPLES ───────────────────────────────────────────────────────
    defineField({
      name: "principlesEyebrow",
      title: "Our Principles — Eyebrow",
      type: LOCALIZED_STRING_TYPE,
      group: "ourPrinciples",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "principlesHeadline",
      title: "Our Principles — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "ourPrinciples",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "principles",
      title: "Principles",
      type: "array",
      group: "ourPrinciples",
      of: [
        defineArrayMember({
          type: "object",
          name: "principle",
          fields: [
            defineField({ name: "title", title: "Title", type: LOCALIZED_STRING_TYPE, validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: LOCALIZED_TEXT_TYPE, validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: "title.en" },
          },
        }),
      ],
    }),

    // ─── OUR PEOPLE (chrome) ─────────────────────────────────────────────────
    defineField({
      name: "peopleEyebrow",
      title: "Our People — Eyebrow",
      type: LOCALIZED_STRING_TYPE,
      group: "ourPeople",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "peopleHeadline",
      title: "Our People — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "ourPeople",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "peopleSubtitle",
      title: "Our People — Subtitle",
      type: LOCALIZED_TEXT_TYPE,
      group: "ourPeople",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coreTeamHeader",
      title: "Core Team — Section Header",
      type: LOCALIZED_STRING_TYPE,
      group: "ourPeople",
      description: 'e.g. "Core Team"',
    }),
    defineField({
      name: "coreTeamSubheader",
      title: "Core Team — Section Subheader",
      type: LOCALIZED_STRING_TYPE,
      group: "ourPeople",
      description: 'e.g. "Leadership & Operations"',
    }),
    defineField({
      name: "advisoryBoardHeader",
      title: "Advisory Board — Section Header",
      type: LOCALIZED_STRING_TYPE,
      group: "ourPeople",
      description: 'e.g. "Advisory Board"',
    }),
    defineField({
      name: "advisoryBoardSubheader",
      title: "Advisory Board — Section Subheader",
      type: LOCALIZED_STRING_TYPE,
      group: "ourPeople",
      description: 'e.g. "Strategic Guidance & Governance"',
    }),

    // ─── PARTNERSHIP ──────────────────────────────────────────────────────────
    defineField({
      name: "partnershipEyebrow",
      title: "Partnership — Eyebrow",
      type: LOCALIZED_STRING_TYPE,
      group: "partnership",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "partnershipHeadline",
      title: "Partnership — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "partnership",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "partnershipSubtitle",
      title: "Partnership — Subtitle",
      type: LOCALIZED_TEXT_TYPE,
      group: "partnership",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "leftBannerHeadline",
      title: "Left Banner — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "partnership",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "leftBannerParagraph",
      title: "Left Banner — Paragraph",
      type: LOCALIZED_TEXT_TYPE,
      group: "partnership",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "leftBannerCtaLabel",
      title: "Left Banner — CTA Label",
      type: LOCALIZED_STRING_TYPE,
      group: "partnership",
      description: 'Links to /partner.',
    }),
    defineField({
      name: "rightBannerHeadline",
      title: "Right Banner — Headline",
      type: LOCALIZED_STRING_TYPE,
      group: "partnership",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rightBannerParagraph",
      title: "Right Banner — Paragraph",
      type: LOCALIZED_TEXT_TYPE,
      group: "partnership",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rightBannerCtaLabel",
      title: "Right Banner — CTA Label",
      type: LOCALIZED_STRING_TYPE,
      group: "partnership",
    }),
    defineField({
      name: "rightBannerEmail",
      title: "Right Banner — Email Address",
      type: "string",
      group: "partnership",
      description: "Contact email shown on the right CTA banner.",
      validation: (Rule) => Rule.email(),
    }),
  ],
  preview: {
    select: { title: "heroHeadline.en" },
    prepare: ({ title }) => ({ title: title ?? "About Page" }),
  },
});
