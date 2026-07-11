import { defineField, defineType } from "sanity";

export const LOCALIZED_TEXT_TYPE = "localizedText";

export const localizedText = defineType({
  name: LOCALIZED_TEXT_TYPE,
  title: "Localized Text (multi-line)",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fr",
      title: "French",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "en" },
  },
});
