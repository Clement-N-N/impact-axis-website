import { defineArrayMember, defineField, defineType } from "sanity";
import { LOCALIZED_STRING_TYPE } from "../objects/localizedString";
import { LOCALIZED_TEXT_TYPE } from "../objects/localizedText";

export const HOME_FAQ_ID = "homeFaq";
export const HOME_FAQ_TYPE = "homeFaq";

export const homeFaq = defineType({
  name: HOME_FAQ_TYPE,
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: LOCALIZED_STRING_TYPE,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: LOCALIZED_TEXT_TYPE,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "question.en" },
            prepare({ title }) {
              return { title: title || "Untitled question" };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "FAQ" };
    },
  },
});
