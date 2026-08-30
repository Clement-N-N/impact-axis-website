import { defineField, defineType } from "sanity";

export const EVENT_PARTNER_TYPE = "eventPartner";

export const eventPartner = defineType({
  name: EVENT_PARTNER_TYPE,
  title: "Event Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Important for accessibility and SEO.",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
