import { defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";
import { BLOG_POST_TYPE } from "../blogPost";

export const BLOG_PAGE_ID = "blogPage";
export const BLOG_PAGE_TYPE = "blogPage";

/**
 * Everything on the blog that isn't a post: the navy banner at the top of the
 * blog page, which post is featured, and the call to action shown at the
 * bottom of the blog page and at the end of every article.
 */
export const blogPage = defineType({
  name: BLOG_PAGE_TYPE,
  title: "Blog Page",
  type: "document",
  groups: [
    { name: "banner", title: "Top banner", default: true },
    { name: "cta", title: "Call to action" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Small label",
      type: LOCALIZED_STRING_TYPE,
      group: "banner",
      description: "The short yellow label above the headline, e.g. \"Impact Blog\".",
    }),
    defineField({ name: "title", title: "Headline", type: LOCALIZED_STRING_TYPE, group: "banner" }),
    defineField({ name: "intro", title: "Introduction", type: LOCALIZED_TEXT_TYPE, group: "banner" }),
    defineField({
      name: "featuredPost",
      title: "Featured post",
      type: "reference",
      to: [{ type: BLOG_POST_TYPE }],
      group: "banner",
      description: "Shown as the large card under the banner. Leave empty to feature the newest post.",
    }),
    defineField({
      name: "cta",
      title: "Call to action",
      type: "object",
      group: "cta",
      description: "Shown at the bottom of the blog page and at the end of every article.",
      fields: [
        defineField({ name: "eyebrow", title: "Small label", type: LOCALIZED_STRING_TYPE }),
        defineField({ name: "title", title: "Headline", type: LOCALIZED_STRING_TYPE }),
        defineField({ name: "text", title: "Text", type: LOCALIZED_TEXT_TYPE }),
        defineField({ name: "buttonLabel", title: "Button text", type: LOCALIZED_STRING_TYPE }),
        defineField({
          name: "buttonHref",
          title: "Button link",
          type: "string",
          description: "A page on this site, like /what-we-do, or a full web address starting with https://.",
          validation: (Rule) =>
            Rule.custom((value) =>
              !value || /^(\/|https?:\/\/|mailto:)/.test(value)
                ? true
                : "Start with / for a page on this site, or https:// for another website.",
            ),
        }),
        defineField({
          name: "image",
          title: "Photo",
          type: "image",
          options: { hotspot: true },
          description: "Optional. Shown beside the text at the end of each article.",
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Blog Page" }) },
});
