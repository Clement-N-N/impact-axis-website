import type { BlogBodyContent } from "./types";

export const blogBodyContent: BlogBodyContent = {
  readMoreLabel: { en: "Read more", fr: "En savoir plus" },
  posts: [
    {
      id: "goodwill-fellowship-doctor",
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
    {
      id: "youth-voices-leadership",
      image: "/images/alumni-2.png",
      title: {
        en: "Youth Voices: Five Fellows on What Leadership Means to Them",
        fr: "Voix des jeunes : cinq boursiers racontent ce que le leadership signifie pour eux",
      },
      excerpt: {
        en: "We asked five fellows from our latest cohort to share what leadership looks like in their own communities — the answers surprised us.",
        fr: "Nous avons demandé à cinq boursiers de notre dernière promotion ce à quoi ressemble le leadership dans leur propre communauté — les réponses nous ont surpris.",
      },
      // TODO: fr date is a draft translation — flag for native/fluent French review.
      date: { en: "May 2, 2025", fr: "2 mai 2025" },
      href: "#",
    },
    {
      id: "systems-first-cohort-lessons",
      image: "/images/alumni-3.png",
      title: {
        en: "Building Systems That Last: Lessons from Our First Cohort",
        fr: "Construire des systèmes durables : les leçons de notre première promotion",
      },
      excerpt: {
        en: "Two years after launch, we look back at what worked, what didn't, and how our program design has evolved to better serve young Cameroonians.",
        fr: "Deux ans après le lancement, nous revenons sur ce qui a fonctionné, ce qui n'a pas fonctionné, et sur l'évolution de notre programme pour mieux servir les jeunes Camerounais.",
      },
      // TODO: fr date is a draft translation — flag for native/fluent French review.
      date: { en: "Feb 14, 2025", fr: "14 février 2025" },
      href: "#",
    },
    {
      id: "partnering-for-impact",
      image: "/images/alumni-4.png",
      title: {
        en: "Partnering for Impact: How Local Organizations Are Scaling Change",
        fr: "Des partenariats pour l'impact : comment les organisations locales font grandir le changement",
      },
      excerpt: {
        en: "From skills training to job placement, our partner organizations are helping fellows turn their ambitions into lasting community impact.",
        fr: "De la formation aux compétences au placement professionnel, nos organisations partenaires aident les boursiers à transformer leurs ambitions en impact communautaire durable.",
      },
      // TODO: fr date is a draft translation — flag for native/fluent French review.
      date: { en: "Jan 20, 2025", fr: "20 janvier 2025" },
      href: "#",
    },
    {
      id: "future-of-work-cameroon",
      image: "/images/alumni-5.png",
      title: {
        en: "The Future of Work: Preparing Young Cameroonians for Tomorrow's Economy",
        fr: "L'avenir du travail : préparer les jeunes Camerounais à l'économie de demain",
      },
      excerpt: {
        en: "As the job market shifts, we're rethinking what skills fellows need to thrive — and how our program is adapting to keep up.",
        fr: "Alors que le marché de l'emploi évolue, nous repensons les compétences dont les boursiers ont besoin pour réussir — et adaptons notre programme en conséquence.",
      },
      // TODO: fr date is a draft translation — flag for native/fluent French review.
      date: { en: "Nov 5, 2024", fr: "5 nov. 2024" },
      href: "#",
    },
  ],
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
