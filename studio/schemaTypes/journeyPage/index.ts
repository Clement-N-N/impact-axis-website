import { defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";

export const JOURNEY_PAGE_TYPE = "journeyPage";
export const JOURNEY_PAGE_ID = "journeyPage";

/**
 * journeyPage — singleton document for the Our Journey page hero + CTA.
 *
 * This is a singleton: there is only ever one "journeyPage" document.
 * It controls the hero section and the CTA block at the bottom of the page.
 * The milestones themselves are separate journeyMilestone documents.
 *
 * Editing guide:
 *  hero section:
 *    - badge     : Eyebrow label (EN + FR)
 *    - headline  : Large hero heading (EN + FR)
 *    - subtitle  : Descriptive sub-heading (EN + FR)
 *    - backLink  : Text for the "back to About" link (EN + FR)
 *
 *  CTA section (bottom of page):
 *    - ctaTag      : Small tag above the headline (EN + FR)
 *    - ctaHeadline : CTA heading (EN + FR)
 *    - ctaParagraph: CTA body text (EN + FR)
 *    - ctaPartner  : Primary button label (EN + FR)
 *    - ctaReports  : Secondary button label (EN + FR)
 */
export const journeyPage = defineType({
  name: JOURNEY_PAGE_TYPE,
  title: "Our Journey Page",
  type: "document",
  fields: [
    // ─── Hero ─────────────────────────────────────────────────────────────────
    defineField({
      name: "heroBadge",
      title: "Hero — Eyebrow Badge",
      type: LOCALIZED_STRING_TYPE,
      description: 'Short label above the headline, e.g. "Our Journey".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero — Headline",
      type: LOCALIZED_STRING_TYPE,
      description: 'Large hero heading, e.g. "A Journey of Evolution".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero — Subtitle",
      type: LOCALIZED_TEXT_TYPE,
      description: "Short descriptive paragraph below the hero headline.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroBackLink",
      title: "Hero — Back Link Label",
      type: LOCALIZED_STRING_TYPE,
      description: 'Text for the "← Back to About Us" link.',
      validation: (Rule) => Rule.required(),
    }),

    // ─── CTA ──────────────────────────────────────────────────────────────────
    defineField({
      name: "ctaTag",
      title: "CTA — Tag",
      type: LOCALIZED_STRING_TYPE,
      description: 'Small badge above the CTA headline, e.g. "Next in Our Story".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaHeadline",
      title: "CTA — Headline",
      type: LOCALIZED_STRING_TYPE,
      description: 'CTA heading, e.g. "Help us build what comes next."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaParagraph",
      title: "CTA — Body Text",
      type: LOCALIZED_TEXT_TYPE,
      description: "Supporting paragraph inside the CTA card.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaPartner",
      title: "CTA — Primary Button Label",
      type: LOCALIZED_STRING_TYPE,
      description: 'Primary action label, e.g. "Partner with us →". Links to /partner.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaReports",
      title: "CTA — Secondary Button Label",
      type: LOCALIZED_STRING_TYPE,
      description: 'Secondary action label, e.g. "Our Yearly Reports". Links to /impact.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "heroHeadline.en" },
    prepare({ title }) {
      return { title: title ?? "Our Journey Page" };
    },
  },
});
