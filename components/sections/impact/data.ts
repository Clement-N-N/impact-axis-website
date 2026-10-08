import type { ImpactPageContent } from "./types";

// TODO: the French here is a first-pass translation and needs native review,
// flagged for native French review.
export const impactPageContent: ImpactPageContent = {
  hero: {
    eyebrow: { en: "Reports & Accountability", fr: "Rapports et redevabilité" },
    headline: {
      en: "Our numbers, in the open.",
      fr: "Nos chiffres, en toute transparence.",
    },
    intro: {
      en: "Explore our results and reports to see what we have done, what we are learning and where we are going next.",
      fr: "Consultez nos résultats et nos rapports pour découvrir ce que nous avons accompli, ce que nous apprenons et la direction que nous prenons.",
    },
    readLatest: { en: "Read the latest report", fr: "Lire le dernier rapport" },
    browse: { en: "Browse all reports", fr: "Voir tous les rapports" },
  },

  stats: {
    eyebrow: { en: "Where we are", fr: "Où nous en sommes" },
    headline: {
      en: "A growing track record. A clear direction.",
      fr: "Un bilan qui s'étoffe. Une direction claire.",
    },
    stats: [
      {
        value: "450+",
        label: {
          en: "Young people reached",
          fr: "Jeunes accompagnés",
        },
      },
      {
        value: "65%",
        visual: "ring",
        label: {
          en: "Growth in employability skills",
          fr: "Progression des compétences d'employabilité",
        },
      },
      {
        value: "55%",
        visual: "ring",
        label: {
          en: "Access meaningful opportunities within 6 months",
          fr: "Accèdent à des opportunités porteuses de sens sous 6 mois",
        },
      },
      {
        value: "$1.5M+",
        featured: true,
        label: {
          en: "Value of opportunities unlocked",
          fr: "Valeur des opportunités débloquées",
        },
      },
      {
        value: "67%",
        visual: "bar",
        label: {
          en: "Young women represented",
          fr: "De jeunes femmes représentées",
        },
      },
    ],
  },

  library: {
    eyebrow: { en: "Document library", fr: "Bibliothèque de documents" },
    headline: {
      en: "Every report, in one place.",
      fr: "Tous nos rapports, au même endroit.",
    },
    intro: {
      en: "We report at key points in the year so our community, partners and funders can see what we are doing, what is changing and how we are growing.",
      fr: "Nous publions des rapports à des moments clés de l'année pour que notre communauté, nos partenaires et nos financeurs voient ce que nous faisons, ce qui évolue et comment nous grandissons.",
    },
    all: { en: "All", fr: "Tous" },
    categories: {
      annual: { en: "Annual", fr: "Annuel" },
      midYear: { en: "Mid-year", fr: "Mi-parcours" },
      financial: { en: "Financial", fr: "Financier" },
    },
    latest: { en: "Latest", fr: "Le plus récent" },
    read: { en: "Read", fr: "Lire" },
    download: { en: "Download PDF", fr: "Télécharger le PDF" },
    empty: {
      en: "Our first report will be published here.",
      fr: "Notre premier rapport sera publié ici.",
    },
  },

  commitment: {
    eyebrow: { en: "Our commitment", fr: "Notre engagement" },
    headline: {
      en: "Transparency is part of how we build trust.",
      fr: "La transparence fait partie de la façon dont nous bâtissons la confiance.",
    },
    paragraphs: [
      {
        en: "We are still strengthening our evidence, reporting and organisational systems as Impact Axis grows. We believe accountability means being clear about our progress, honest about what we are still learning and intentional about improving how we serve young people.",
        fr: "Nous continuons de renforcer nos données, nos rapports et nos systèmes organisationnels à mesure qu'Impact Axis grandit. Pour nous, la redevabilité consiste à être clairs sur nos progrès, honnêtes sur ce que nous apprenons encore et volontaires dans l'amélioration de notre accompagnement des jeunes.",
      },
      {
        en: "If you are a funder, partner or stakeholder looking for additional information about our programmes, finances or organisational performance, our team would be glad to help.",
        fr: "Si vous êtes financeur, partenaire ou partie prenante et souhaitez des informations complémentaires sur nos programmes, nos finances ou nos performances, notre équipe se fera un plaisir de vous aider.",
      },
    ],
    cta: {
      label: { en: "Contact us", fr: "Nous contacter" },
      href: "/contact",
    },
  },
};
