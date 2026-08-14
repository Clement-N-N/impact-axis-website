import type { BlogHeroContent } from "./types";

export const blogHeroContent: BlogHeroContent = {
  title: { en: "Impact Blog", fr: "Blog Impact" },
  readMoreLabel: { en: "Read more", fr: "En savoir plus" },
  posts: [
    {
      id: "goodwill-fellowship-2026",
      image: "/images/team-1.jpg",
      title: {
        en: "Unlock Your Potential: Apply for the Goodwill Fellowship 2026 Today",
        fr: "Libérez votre potentiel : postulez dès aujourd'hui à la bourse Goodwill 2026",
      },
      excerpt: {
        en: "Are you a young Cameroonian ready to take charge of your future? The Goodwill Fellowship 2026 offers a unique chance to develop leadership skills, gain practical experience, and connect with a community of like-minded changemakers.",
        fr: "Êtes-vous un jeune Camerounais prêt à prendre en main votre avenir ? La bourse Goodwill 2026 offre une occasion unique de développer des compétences en leadership, d'acquérir une expérience pratique et de rejoindre une communauté d'acteurs du changement.",
      },
      // TODO: fr date is a draft translation — flag for native/fluent French review.
      date: { en: "Jun 13, 2026", fr: "13 juin 2026" },
      href: "#",
    },
    {
      id: "international-womens-day",
      image: "/images/alumni-1.jpg",
      title: {
        en: "Empowering Young Women to Shape the Future: Celebrating International Women's Day",
        fr: "Donner aux jeunes femmes les moyens de façonner l'avenir : célébrer la Journée internationale des femmes",
      },
      excerpt: {
        en: "Today, as we celebrate International Women's Day, we reflect on the young women shaping the future of their communities through leadership, innovation, and resilience.",
        fr: "Aujourd'hui, alors que nous célébrons la Journée internationale des femmes, nous rendons hommage aux jeunes femmes qui façonnent l'avenir de leurs communautés par le leadership, l'innovation et la résilience.",
      },
      // TODO: fr date is a draft translation — flag for native/fluent French review.
      date: { en: "Mar 9, 2025", fr: "9 mars 2025" },
      href: "#",
    },
  ],
};
