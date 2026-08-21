import type { BlogBodyContent } from "./types";

export const blogBodyContent: BlogBodyContent = {
  readMoreLabel: { en: "Read more", fr: "En savoir plus" },
  promoCard: {
    image: "/images/girls-2.jpg",
    badgeLabel: { en: "Application open", fr: "Candidatures ouvertes" },
    title: {
      en: "Apply for the 4th cohort of the goodwill fellowship program",
      fr: "Postulez pour la 4e promotion du programme de bourse Goodwill",
    },
    // TODO: fr date is a draft translation — flag for native/fluent French review.
    dateLine: {
      en: "Applications end on June 25th, 2026",
      fr: "Les candidatures se terminent le 25 juin 2026",
    },
    applyButton: {
      label: { en: "Apply now", fr: "Postuler maintenant" },
      href: "/programs",
    },
    learnMoreButton: {
      label: { en: "Learn more", fr: "En savoir plus" },
      href: "/programs",
    },
  },
  categoriesHeading: { en: "All categories", fr: "Toutes les catégories" },
  viewAllCategoriesLabel: { en: "View all", fr: "Tout afficher" },
};
