import { defineArrayMember, defineField, defineType } from "sanity";

export const LOCALIZED_PORTABLE_TEXT_TYPE = "localizedPortableText";

const portableTextBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H3", value: "h3" },
    { title: "H4", value: "h4" },
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
            title: "URL",
            type: "url",
            validation: (Rule) =>
              Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }).required(),
          }),
        ],
      }),
    ],
  },
});

export const localizedPortableText = defineType({
  name: LOCALIZED_PORTABLE_TEXT_TYPE,
  title: "Localized Rich Text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [portableTextBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fr",
      title: "French",
      type: "array",
      of: [portableTextBlock],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "en" },
    prepare({ title }) {
      const firstBlock = Array.isArray(title)
        ? title.find((block: { _type?: string }) => block?._type === "block")
        : undefined;
      const text = firstBlock?.children
        ?.map((child: { text?: string }) => child.text)
        .join("");
      return { title: text || "Rich text" };
    },
  },
});
