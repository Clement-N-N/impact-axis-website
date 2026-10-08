import { defineArrayMember, defineField, defineType } from "sanity";
import { BLOG_BODY_BLOCKS } from "./blogBlocks";

export const LOCALIZED_BLOG_BODY_TYPE = "localizedBlogBody";

/**
 * Body of a blog post, one per language. Besides text it takes the blocks in
 * ./blogBlocks (images, quotes, highlighted numbers and so on). H2 headings
 * also build the article's "On this page" menu.
 */
const textBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Paragraph", value: "normal" },
    { title: "Section heading (H2)", value: "h2" },
    { title: "Sub-heading (H3)", value: "h3" },
    { title: "Small heading (H4)", value: "h4" },
    { title: "Quote", value: "blockquote" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" },
    ],
    annotations: [
      defineField({
        name: "link",
        title: "Link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            title: "Link",
            type: "url",
            description: "A page on this site, like /what-we-do, or a full web address starting with https://.",
            validation: (Rule) =>
              Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }).required(),
          }),
        ],
      }),
    ],
  },
});

const body = (name: "en" | "fr", title: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [textBlock, ...BLOG_BODY_BLOCKS],
    validation: (Rule) => Rule.required(),
  });

export const localizedBlogBody = defineType({
  name: LOCALIZED_BLOG_BODY_TYPE,
  title: "Article body",
  type: "object",
  fields: [body("en", "English"), body("fr", "French")],
});
