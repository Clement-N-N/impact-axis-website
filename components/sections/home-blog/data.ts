import type { HomeBlogContent } from "./types";

export const homeBlogContent: HomeBlogContent = {
  eyebrow: { en: "Never miss an update", fr: "Ne manquez aucune actualité" },
  readMoreLabel: { en: "Read more", fr: "En savoir plus" },
  moreNewsButton: {
    label: { en: "More news", fr: "Plus d'actualités" },
    href: "#",
  },
  posts: [
    {
      image: "/images/team-1.jpg",
      title: {
        en: "Unlock Your Potential: Apply for the Goodwill Fellowship 2026 Today",
        fr: "Libérez votre potentiel : postulez dès aujourd'hui à la bourse Goodwill 2026",
      },
      excerpt: {
        en: "Are you a young Cameroonian ready to take charge of your future? The Goodwill Fellowship 2026 offers a unique chance to develop leadership skills, gain practical experience, and connect with a community of changemakers.",
        fr: "Êtes-vous un jeune Camerounais prêt à prendre en main votre avenir ? La bourse Goodwill 2026 offre une occasion unique de développer des compétences en leadership, d'acquérir une expérience pratique et de rejoindre une communauté d'acteurs du changement.",
      },
      // TODO: fr date is a draft translation — flag for native/fluent French review.
      date: { en: "Jun 13, 2026", fr: "13 juin 2026" },
      href: "#",
    },
    {
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
    {
      image: "/images/girls-1.jpg",
      title: {
        en: "Unlocking Potential: How the Goodwill Fellowship Empowered a Young Cameroonian Doctor to Make a Community Impact",
        fr: "Libérer le potentiel : comment la bourse Goodwill a permis à un jeune médecin camerounais d'avoir un impact communautaire",
      },
      excerpt: {
        en: "Did you know that nearly three-quarters of young graduates struggle to find work that matches their skills? Here's how one fellow changed that story for his community.",
        fr: "Saviez-vous que près des trois quarts des jeunes diplômés peinent à trouver un emploi correspondant à leurs compétences ? Voici comment un boursier a changé cette réalité pour sa communauté.",
      },
      // TODO: fr date is a draft translation — flag for native/fluent French review.
      date: { en: "Jun 9, 2024", fr: "9 juin 2024" },
      href: "#",
    },
  ],
};
