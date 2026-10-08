import { defineArrayMember, defineField } from "sanity";

/**
 * Extra blocks an editor can insert between paragraphs of a blog post (the
 * "+" / insert menu in the body editor). Each language has its own body, so
 * these are added per language and their text is written in that language.
 */

const imageWithAlt = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        description: "Describe the photo for people who can't see it. Important for accessibility and SEO.",
        validation: (Rule) => Rule.required(),
      }),
    ],
    validation: (Rule) => Rule.required(),
  });

export const blogImageBlock = defineArrayMember({
  name: "blogImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the photo for people who can't see it. Important for accessibility and SEO.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      initialValue: "normal",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Text width", value: "normal" },
          { title: "Wide", value: "wide" },
          { title: "Full width", value: "full" },
        ],
      },
    }),
  ],
  preview: {
    select: { media: "asset", caption: "caption", alt: "alt" },
    prepare: ({ media, caption, alt }) => ({ title: caption || alt || "Image", subtitle: "Image", media }),
  },
});

export const imagePairBlock = defineArrayMember({
  name: "imagePair",
  title: "Two images side by side",
  type: "object",
  fields: [
    imageWithAlt("left", "Left image"),
    imageWithAlt("right", "Right image"),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: {
    select: { media: "left", caption: "caption" },
    prepare: ({ media, caption }) => ({ title: caption || "Two images", subtitle: "Image pair", media }),
  },
});

export const pullQuoteBlock = defineArrayMember({
  name: "pullQuote",
  title: "Pull quote",
  type: "object",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: "attribution",
      title: "Who said it",
      type: "string",
      description: "Optional. For example: \"Akem Aurelia, 2022 fellow\".",
    }),
  ],
  preview: {
    select: { title: "quote", subtitle: "attribution" },
    prepare: ({ title, subtitle }) => ({ title: `“${title ?? ""}”`, subtitle: subtitle ? `Pull quote · ${subtitle}` : "Pull quote" }),
  },
});

export const keyTakeawaysBlock = defineArrayMember({
  name: "keyTakeaways",
  title: "Key takeaways",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      description: "Optional. Defaults to \"Key takeaways\" (\"À retenir\" in French).",
    }),
    defineField({
      name: "items",
      title: "Points",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "Key takeaways",
      subtitle: `${Array.isArray(items) ? items.length : 0} points`,
    }),
  },
});

export const statHighlightBlock = defineArrayMember({
  name: "statHighlight",
  title: "Highlighted number",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Number",
      type: "string",
      description: "For example: 69%, 450+ or $1.5M.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "label", title: "What it means", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: "source", title: "Source", type: "string", description: "Optional, but recommended." }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
    prepare: ({ title, subtitle }) => ({ title: `${title ?? ""} · Highlighted number`, subtitle }),
  },
});

export const tipBoxBlock = defineArrayMember({
  name: "tipBox",
  title: "Tip box",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      description: "Optional. Defaults to \"Tip\" (\"Conseil\" in French).",
    }),
    defineField({ name: "text", title: "Text", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: "title", subtitle: "text" },
    prepare: ({ title, subtitle }) => ({ title: title || "Tip", subtitle }),
  },
});

export const ctaButtonBlock = defineArrayMember({
  name: "ctaButton",
  title: "Button",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Button text", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "A page on this site, like /what-we-do, or a full web address starting with https://.",
      validation: (Rule) =>
        Rule.required().custom((value) =>
          !value || /^(\/|https?:\/\/|mailto:)/.test(value)
            ? true
            : "Start with / for a page on this site, or https:// for another website.",
        ),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
    prepare: ({ title, subtitle }) => ({ title: `Button · ${title ?? ""}`, subtitle }),
  },
});

export const youtubeBlock = defineArrayMember({
  name: "youtube",
  title: "YouTube video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "YouTube link",
      type: "url",
      validation: (Rule) =>
        Rule.required().custom((value) =>
          !value || /youtube\.com|youtu\.be/.test(value) ? true : "Paste a YouTube link.",
        ),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: {
    select: { title: "caption", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({ title: title || "YouTube video", subtitle }),
  },
});

export const BLOG_BODY_BLOCKS = [
  blogImageBlock,
  imagePairBlock,
  pullQuoteBlock,
  keyTakeawaysBlock,
  statHighlightBlock,
  tipBoxBlock,
  ctaButtonBlock,
  youtubeBlock,
];
