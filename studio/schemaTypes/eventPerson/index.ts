import { defineField, defineType } from "sanity";

export const EVENT_PERSON_TYPE = "eventPerson";

export const eventPerson = defineType({
  name: EVENT_PERSON_TYPE,
  title: "Event Person",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
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
    select: { title: "name", media: "image" },
  },
});
