import { defineField, defineType } from "sanity";

export const BLOG_AUTHOR_TYPE = "blogAuthor";

export const blogAuthor = defineType({
  name: BLOG_AUTHOR_TYPE,
  title: "Blog Author",
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
