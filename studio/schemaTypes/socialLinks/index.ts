import { defineField, defineType } from "sanity";

export const SOCIAL_LINKS_ID = "socialLinks";
export const SOCIAL_LINKS_TYPE = "socialLinks";

function socialField(name: string, title: string) {
  return defineField({
    name,
    title,
    description: `Leave empty to hide the ${title} icon everywhere it would appear.`,
    type: "url",
    validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
  });
}

export const socialLinks = defineType({
  name: SOCIAL_LINKS_TYPE,
  title: "Social Links",
  type: "document",
  fields: [
    socialField("facebook", "Facebook"),
    socialField("instagram", "Instagram"),
    socialField("x", "X (Twitter)"),
    socialField("linkedin", "LinkedIn"),
    socialField("youtube", "YouTube"),
  ],
  preview: {
    prepare() {
      return { title: "Social Links" };
    },
  },
});
