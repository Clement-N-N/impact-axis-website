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
      href: "#",
    },
    learnMoreButton: {
      label: { en: "Learn more", fr: "En savoir plus" },
      href: "#",
    },
  },
  categoriesHeading: { en: "All categories", fr: "Toutes les catégories" },
  categories: [
    { label: { en: "Skills & Employability", fr: "Compétences et employabilité" }, href: "#" },
    { label: { en: "Youth Voices", fr: "Voix des jeunes" }, href: "#" },
    { label: { en: "Systems & Insights", fr: "Systèmes et perspectives" }, href: "#" },
    { label: { en: "Partnerships & Impact", fr: "Partenariats et impact" }, href: "#" },
    { label: { en: "Programs & Updates", fr: "Programmes et actualités" }, href: "#" },
    { label: { en: "Future of Work", fr: "Avenir du travail" }, href: "#" },
  ],
};
