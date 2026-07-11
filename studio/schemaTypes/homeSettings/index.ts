import { defineField, defineType } from "sanity";
import { HeroVariantInput } from "./HeroVariantInput";

export const HOME_SETTINGS_ID = "homeSettings";
export const HOME_SETTINGS_TYPE = "homeSettings";

export const homeSettings = defineType({
  name: HOME_SETTINGS_TYPE,
  title: "Home Page Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroVariant",
      title: "Hero variant",
      description: "Choose which hero layout shows on the homepage.",
      type: "string",
      initialValue: "collage-description",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Promo Card", value: "promo-card" },
          { title: "Overlay Welcome", value: "overlay-welcome" },
          { title: "Collage Dark", value: "collage-dark" },
          { title: "Collage Description", value: "collage-description" },
          { title: "Fullbleed Overlay", value: "fullbleed-overlay" },
        ],
      },
      components: {
        input: HeroVariantInput,
      },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page Settings" };
    },
  },
});
