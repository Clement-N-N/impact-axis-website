import { defineField, defineType } from "sanity";

export const LOCALIZED_STRING_TYPE = "localizedString";

export const localizedString = defineType({
  name: LOCALIZED_STRING_TYPE,
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fr",
      title: "French",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "en" },
  },
});
