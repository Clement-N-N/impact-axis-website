import { defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";

export const OPEN_CALL_TYPE = "openCall";

/**
 * An open application, such as a fellowship cohort.
 *
 * The promo card that advertises one used to be typed into two `data.ts` files
 * with its deadline as a display string, so nothing could compare it to today
 * and it kept inviting applications months after the call had closed. Here the
 * dates are real dates: the site only shows a call while `now()` sits between
 * them, and stops on its own afterwards with nobody having to remember.
 *
 * The badge and the date line are generated from these dates rather than being
 * fields, so the wording cannot contradict them.
 */
export const openCall = defineType({
  name: OPEN_CALL_TYPE,
  title: "Open call",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description:
        'What the card announces, e.g. "Apply for the 4th cohort of the Goodwill Fellowship".',
      type: LOCALIZED_STRING_TYPE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "applicationsOpenAt",
      title: "Applications open",
      description: "The card appears on this date.",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "applicationsCloseAt",
      title: "Applications close",
      description:
        "The last day applications are accepted. The card disappears by itself the day after.",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) =>
        Rule.required().min(Rule.valueOfField("applicationsOpenAt")),
    }),
    defineField({
      name: "applyHref",
      title: "Application link",
      description:
        "Where the Apply button goes — usually an application form. A full URL, or a path on this site such as /contact.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "learnMoreHref",
      title: "Learn more link",
      description:
        'Where the second button goes. Defaults to the Goodwill Fellowship section of Our Work if left empty.',
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      openAt: "applicationsOpenAt",
      closeAt: "applicationsCloseAt",
      media: "image",
    },
    prepare({ title, openAt, closeAt, media }) {
      const today = new Date().toISOString().slice(0, 10);
      const state =
        closeAt && closeAt < today
          ? "closed"
          : openAt && openAt > today
            ? "not open yet"
            : "open";
      return {
        title: title || "Untitled open call",
        subtitle: `${openAt ?? "?"} to ${closeAt ?? "?"} · ${state}`,
        media,
      };
    },
  },
});
