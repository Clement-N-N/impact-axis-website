import { defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";
import { LOCALIZED_BLOG_BODY_TYPE } from "../objects/localizedBlogBody";
import { BLOG_AUTHOR_TYPE } from "../blogAuthor";
import { BLOG_CATEGORY_TYPE } from "../blogCategory";

export const BLOG_POST_TYPE = "blogPost";

export const blogPost = defineType({
  name: BLOG_POST_TYPE,
  title: "Blog Post",
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
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: LOCALIZED_TEXT_TYPE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Important for accessibility and SEO.",
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
          description: "Optional. Shown under the cover photo on the article page.",
        }),
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: BLOG_AUTHOR_TYPE }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Author Role (for this post)",
      description:
        "The byline text shown next to the author on this post, e.g. \"Program Team\" or \"2022 Fellowship Participant\". Kept per-post since the same author can be credited differently across posts.",
      type: LOCALIZED_STRING_TYPE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: BLOG_CATEGORY_TYPE }],
    }),
    defineField({
      name: "body",
      title: "Body",
      description:
        "Use the + Insert menu to add images, quotes, highlighted numbers, tip boxes, buttons and videos between paragraphs. Section headings (H2) build the article's \"On this page\" menu.",
      type: LOCALIZED_BLOG_BODY_TYPE,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title.en", media: "image" },
  },
});
