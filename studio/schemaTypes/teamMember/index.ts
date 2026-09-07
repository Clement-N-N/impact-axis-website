import { defineArrayMember, defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";

export const TEAM_MEMBER_TYPE = "teamMember";

/**
 * teamMember — a core team member or advisory board member.
 *
 * Editing guide:
 *  - name       : Full display name
 *  - role       : Job title / role (localised). Advisory board members leave this empty.
 *  - group      : "coreTeam" or "advisoryBoard" — controls which section they appear in
 *  - bio        : Paragraph biography (EN + FR)
 *  - image      : Headshot — use hotspot to control focal point
 *  - initials   : 2-letter fallback shown when no image is available
 *  - order      : Lower number appears first within the group
 */
export const teamMember = defineType({
  name: TEAM_MEMBER_TYPE,
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: LOCALIZED_STRING_TYPE,
      description: "Job title shown on the card. Leave empty for advisory board members if not needed.",
    }),
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      options: {
        list: [
          { title: "Core Team", value: "coreTeam" },
          { title: "Advisory Board", value: "advisoryBoard" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: LOCALIZED_TEXT_TYPE,
      description: "Short paragraph biography shown in the modal or card.",
    }),
    defineField({
      name: "image",
      title: "Headshot",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe the photo for accessibility.",
        }),
      ],
    }),
    defineField({
      name: "initials",
      title: "Initials",
      type: "string",
      description: "2-letter fallback shown when no image is uploaded, e.g. CN.",
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower number appears first within the group.",
      initialValue: 99,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "group",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      const groupLabel = subtitle === "coreTeam" ? "Core Team" : "Advisory Board";
      return { title, subtitle: groupLabel, media };
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [
        { field: "group", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
});
