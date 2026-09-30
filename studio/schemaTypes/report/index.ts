import { defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";

export const REPORT_TYPE = "report";

/**
 * A published report with its PDF.
 *
 * The file lives on Sanity's CDN rather than in the repository: the three
 * existing reports total roughly 31MB, which would sit in git history
 * permanently and could not be updated without a deploy. Holding them here
 * means a new report is an upload, not a release.
 *
 * `publishedAt` drives ordering and the "latest" card on the Impact page, so
 * adding the next report never needs a code change.
 */
export const report = defineType({
  name: REPORT_TYPE,
  title: "Report",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description:
        'As it should read on the site, e.g. "2025 Annual Report".',
      type: LOCALIZED_STRING_TYPE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Type of report",
      description: "Groups the report under a heading on the Impact page.",
      type: "string",
      initialValue: "annual",
      options: {
        list: [
          { title: "Annual report", value: "annual" },
          { title: "Mid-year progress report", value: "midYear" },
          { title: "Financial report", value: "financial" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      description:
        "Used to order reports and to pick the latest one. For an annual report, use any date within the year it covers.",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "periodLabel",
      title: "Period covered",
      description:
        'Shown beside the title, e.g. "2025" or "January – June 2026". Leave empty to show nothing.',
      type: LOCALIZED_STRING_TYPE,
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description:
        "One or two sentences describing what the report covers. Shown on the latest-report card.",
      type: LOCALIZED_TEXT_TYPE,
    }),
    defineField({
      name: "file",
      title: "PDF",
      description: "The report itself. Visitors can read it in the browser or download it.",
      type: "file",
      options: { accept: "application/pdf" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      description: "Optional. Used as the thumbnail if provided.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "featured",
      title: "Feature as the latest report",
      description:
        "Pins this report to the highlighted card at the top of the page. If none is ticked, the most recently published one is used.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.en",
      category: "category",
      publishedAt: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, category, publishedAt, media }) {
      const labels: Record<string, string> = {
        annual: "Annual",
        midYear: "Mid-year",
        financial: "Financial",
      };
      const year = publishedAt ? String(publishedAt).slice(0, 4) : "no date";
      return {
        title: title || "Untitled report",
        subtitle: `${labels[category] ?? category ?? "Report"} · ${year}`,
        media,
      };
    },
  },
});
