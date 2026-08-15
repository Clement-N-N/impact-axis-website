import { defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";
import { LOCALIZED_PORTABLE_TEXT_TYPE } from "../objects/localizedPortableText";

export const TESTIMONIAL_TYPE = "testimonial";

export const testimonial = defineType({
  name: TESTIMONIAL_TYPE,
  title: "Testimonial Entry",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title / Role",
      type: LOCALIZED_STRING_TYPE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description: "Short pull-quote shown in compact contexts like the home carousel.",
      type: LOCALIZED_TEXT_TYPE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Full rich-text testimonial, for future long-form use.",
      type: LOCALIZED_PORTABLE_TEXT_TYPE,
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
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/*" },
    }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
