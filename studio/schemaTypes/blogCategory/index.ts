import { defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";

export const BLOG_CATEGORY_TYPE = "blogCategory";

export const blogCategory = defineType({
  name: BLOG_CATEGORY_TYPE,
  title: "Blog Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: LOCALIZED_STRING_TYPE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title.en" },
  },
});
