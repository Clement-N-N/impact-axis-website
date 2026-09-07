import { defineArrayMember, defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";

export const JOURNEY_MILESTONE_TYPE = "journeyMilestone";

/**
 * journeyMilestone — one entry in the Our Journey timeline.
 *
 * Each milestone is an independent document so it can be:
 *  - Created, reordered or deleted without touching other entries
 *  - The "latest" milestone is always the one with the highest year value
 *    (determined at query time via order(year desc))
 *
 * Editing guide:
 *  - year        : 4-digit year string, e.g. "2026"
 *  - shortYear   : 2-digit label shown on the timeline node, e.g. "26"
 *  - badge       : Short status label (EN + FR), e.g. "In Progress"
 *  - phase       : Phase descriptor (EN + FR), e.g. "Building What Comes Next"
 *  - title       : Full display title of the card (EN + FR)
 *  - description : Main narrative paragraph (EN + FR)
 *  - yearSubtitle: Secondary label shown beside year watermark (EN + FR)
 *  - tags        : Array of plain strings — partner names or milestone tags
 *  - image       : Optional image attached to this milestone (hotspot enabled)
 */
export const journeyMilestone = defineType({
  name: JOURNEY_MILESTONE_TYPE,
  title: "Journey Milestone",
  type: "document",
  fields: [
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      description: "4-digit year, e.g. 2026. Used for ordering — highest year = latest milestone.",
      validation: (Rule) =>
        Rule.required().regex(/^\d{4}$/, { name: "year format", invert: false }),
    }),
    defineField({
      name: "shortYear",
      title: "Short Year",
      type: "string",
      description: "2-digit label shown on the spine node, e.g. 26.",
      validation: (Rule) =>
        Rule.required().regex(/^\d{2}$/, { name: "short year format", invert: false }),
    }),
    defineField({
      name: "badge",
      title: "Badge Label",
      type: LOCALIZED_STRING_TYPE,
      description: 'Short status or highlight, e.g. "Pilot Launch" / "In Progress".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phase",
      title: "Phase",
      type: LOCALIZED_STRING_TYPE,
      description: 'Phase name shown beside the badge, e.g. "Inception".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Card Title",
      type: LOCALIZED_STRING_TYPE,
      description: 'Main heading on the card, e.g. "2021 — Our Genesis".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: LOCALIZED_TEXT_TYPE,
      description: "Main narrative paragraph describing what happened this year.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "yearSubtitle",
      title: "Year Subtitle",
      type: LOCALIZED_STRING_TYPE,
      description: 'Short phrase beside the year watermark, e.g. "Foundation & Initial Research".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags / Partners",
      type: "array",
      description: "Partner names or milestone labels shown as pills at the bottom of the card.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "image",
      title: "Milestone Image (optional)",
      type: "image",
      description: "Optional image associated with this milestone year.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe the image for accessibility and SEO.",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "year",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: `${subtitle} — ${title ?? "Untitled"}`,
        subtitle,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Year (oldest first)",
      name: "yearAsc",
      by: [{ field: "year", direction: "asc" }],
    },
    {
      title: "Year (newest first)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
});
