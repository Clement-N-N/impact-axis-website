import { defineArrayMember, defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";

export const HOME_IMPACT_ID = "homeImpact";
export const HOME_IMPACT_TYPE = "homeImpact";

export const homeImpact = defineType({
  name: HOME_IMPACT_TYPE,
  title: "Home Page Impact Stats",
  type: "document",
  fields: [
    defineField({
      name: "metrics",
      title: "Impact Stats",
      description:
        "Number + label shown on each impact card, in display order. Card visuals (image, color) are fixed by position in code — if there are more than 6 stats, the 6 card designs repeat in sequence.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "impactStat",
          fields: [
            defineField({
              name: "number",
              title: "Number",
              description: 'The big stat, e.g. "450+", "3.5x", "92%".',
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: LOCALIZED_STRING_TYPE,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { number: "number", label: "label.en" },
            prepare({ number, label }) {
              return { title: `${number} — ${label}` };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page Impact Stats" };
    },
  },
});
