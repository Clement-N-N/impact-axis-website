import { defineField, defineType } from "sanity";

export const PARTNER_LOGO_TYPE = "partnerLogo";

/**
 * partnerLogo — one entry in the partners marquee / grid on the About page.
 *
 * Editing guide:
 *  - name   : Partner organisation name (shown as alt text)
 *  - logo   : Logo image — upload a high-quality PNG/SVG with transparent background
 *  - order  : Lower number appears first in the marquee
 *
 * To add a new partner: create a new document, upload their logo, set the order.
 * To remove a partner: delete the document.
 * To reorder: adjust the order numbers.
 */
export const partnerLogo = defineType({
  name: PARTNER_LOGO_TYPE,
  title: "Partner Logo",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Organisation Name",
      type: "string",
      description: "Used as the image alt text for accessibility.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Prefer PNG with transparent background or SVG.",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Leave blank to use the organisation name above.",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower number appears first in the marquee.",
      initialValue: 99,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
