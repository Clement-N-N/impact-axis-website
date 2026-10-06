import { defineArrayMember, defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";

export const HOME_IMPACT_ID = "homeImpact";
export const HOME_IMPACT_TYPE = "homeImpact";

export const homeImpact = defineType({
  name: HOME_IMPACT_TYPE,
  title: "Impact Stats",
  type: "document",
  fields: [
    defineField({
      name: "metrics",
      title: "Impact Stats",
      description:
        "The figures shown on the home page, the Impact page and Work With Us, in display order. On the home page, card visuals (image, color) are fixed by position in code. On the Impact page, each figure can be drawn as a ring or bar and one can be featured large (see each figure's settings).",
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
            defineField({
              name: "visual",
              title: "Impact page visual",
              description:
                "How the figure is drawn on the Impact page. Ring and bar only work for percentages (e.g. 65%).",
              type: "string",
              initialValue: "number",
              options: {
                list: [
                  { title: "Number only", value: "number" },
                  { title: "Ring (percentage)", value: "ring" },
                  { title: "Bar (percentage)", value: "bar" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
            }),
            defineField({
              name: "featured",
              title: "Feature on the Impact page",
              description:
                "Shows this figure as the large navy tile at the top of the Impact page. Tick only one; if none is ticked, the first figure is used.",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "detail",
              title: "Supporting line (optional)",
              description:
                "One short sentence of context under the figure on the Impact page, e.g. what it counts and since when.",
              type: LOCALIZED_TEXT_TYPE,
            }),
          ],
          preview: {
            select: { number: "number", label: "label.en", featured: "featured" },
            prepare({ number, label, featured }) {
              return { title: `${number} — ${label}`, subtitle: featured ? "Featured on the Impact page" : undefined };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Impact Stats" };
    },
  },
});
