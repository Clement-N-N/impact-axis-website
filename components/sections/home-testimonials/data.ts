import type { HomeTestimonialsContent } from "./types";

export const homeTestimonialsChrome: Pick<HomeTestimonialsContent, "title" | "seeAllStoriesButton"> = {
  title: { en: "You belong at Impact Axis", fr: "Vous avez votre place chez Impact Axis" },
  seeAllStoriesButton: {
    label: { en: "See all stories", fr: "Voir toutes les histoires" },
    href: "/blog",
  },
};
