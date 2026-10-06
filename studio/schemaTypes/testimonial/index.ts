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
      name: "youtubeUrl",
      title: "YouTube link",
      description:
        "Preferred for videos: paste the YouTube link (e.g. https://www.youtube.com/watch?v=…). It streams at the right quality for each visitor and is used instead of an uploaded video. Its thumbnail is shown when there's no image.",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https"] }).custom((value) =>
          !value || /(?:youtube\.com|youtu\.be)\//.test(value) ? true : "Use a YouTube link",
        ),
    }),
    defineField({
      name: "video",
      title: "Video file (optional)",
      description:
        "Only if the video isn't on YouTube. Large files load slowly on phones, so keep them short.",
      type: "file",
      options: { accept: "video/*" },
    }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
