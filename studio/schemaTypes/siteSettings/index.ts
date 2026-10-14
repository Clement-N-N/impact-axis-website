import { defineField, defineType } from "sanity";

export const SITE_SETTINGS_ID = "siteSettings";
export const SITE_SETTINGS_TYPE = "siteSettings";

export const siteSettings = defineType({
  name: SITE_SETTINGS_TYPE,
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "showEventsPage",
      title: "Show the Events page",
      description:
        "Off: the Events page is hidden. It is removed from the menus and the sitemap, and visitors who open its link go to the home page. Your events stay saved. Turn on and publish to bring it back.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
