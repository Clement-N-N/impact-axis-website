import { defineArrayMember, defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_PORTABLE_TEXT_TYPE } from "../objects/localizedPortableText";
import { EVENT_PERSON_ROLE_TYPE } from "../objects/eventPersonRole";
import { EVENT_PARTNER_TYPE } from "../eventPartner";

export const EVENT_TYPE = "event";

export const event = defineType({
  name: EVENT_TYPE,
  title: "Event",
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
      name: "location",
      title: "Location",
      type: LOCALIZED_STRING_TYPE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "registerHref",
      title: "Register URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }).required(),
    }),
    defineField({
      name: "speakers",
      title: "Speakers",
      type: "array",
      of: [defineArrayMember({ type: EVENT_PERSON_ROLE_TYPE })],
    }),
    defineField({
      name: "partners",
      title: "Partners",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: EVENT_PARTNER_TYPE }] })],
    }),
    defineField({
      name: "programOverview",
      title: "Program Overview",
      type: LOCALIZED_PORTABLE_TEXT_TYPE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "specialGuests",
      title: "Special Guests",
      type: "array",
      of: [defineArrayMember({ type: EVENT_PERSON_ROLE_TYPE })],
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "date", media: "heroImage" },
  },
});
