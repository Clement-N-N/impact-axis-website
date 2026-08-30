import { defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "./localizedString";
import { EVENT_PERSON_TYPE } from "../eventPerson";

export const EVENT_PERSON_ROLE_TYPE = "eventPersonRole";

export const eventPersonRole = defineType({
  name: EVENT_PERSON_ROLE_TYPE,
  title: "Event Person Role",
  type: "object",
  fields: [
    defineField({
      name: "person",
      title: "Person",
      type: "reference",
      to: [{ type: EVENT_PERSON_TYPE }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title (for this event)",
      description:
        "The role/title shown for this person on this event, e.g. \"Keynote Speaker\" or \"Panelist\". Kept per-event since the same person can be credited differently across events.",
      type: LOCALIZED_STRING_TYPE,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "person.name", subtitle: "title.en", media: "person.image" },
  },
});
