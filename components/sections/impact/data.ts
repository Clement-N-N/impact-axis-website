import type { ImpactPageContent } from "./types";

// TODO: the French here is a first-pass translation and needs native review,
// matching the note on `blog-body/data.ts`.
export const impactPageContent: ImpactPageContent = {
  hero: {
    eyebrow: { en: "Reports & Accountability", fr: "Rapports et redevabilité" },
    headline: {
      en: "Progress should be visible.",
      fr: "Les progrès doivent être visibles.",
    },
    paragraphs: [
      {
        en: "As a nonprofit youth workforce development organisation in Cameroon, Impact Axis is committed to being transparent about our programmes, progress, finances and the outcomes we are working to achieve with young people.",
        fr: "En tant qu'organisation à but non lucratif dédiée au développement de l'employabilité des jeunes au Cameroun, Impact Axis s'engage à être transparente sur ses programmes, ses progrès, ses finances et les résultats qu'elle vise avec les jeunes.",
      },
      {
        en: "Explore our reports and accountability documents to see what we have done, what we are learning and where we are going next.",
        fr: "Consultez nos rapports et documents de redevabilité pour découvrir ce que nous avons accompli, ce que nous apprenons et la direction que nous prenons.",
      },
    ],
    cta: {
      label: { en: "View our latest report", fr: "Voir notre dernier rapport" },
      href: "#latest-report",
    },
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
        label: {
          en: "Growth in employability skills",
          fr: "Progression des compétences d'employabilité",
        },
      },
      {
        value: "55%",
        label: {
          en: "Access meaningful opportunities within 6 months",
          fr: "Accèdent à des opportunités porteuses de sens sous 6 mois",
        },
      },
      {
        value: "$1.5M+",
        label: {
          en: "Value of opportunities unlocked",
          fr: "Valeur des opportunités débloquées",
        },
      },
      {
        value: "67%",
        label: {
          en: "Young women represented",
          fr: "De jeunes femmes représentées",
        },
      },
    ],
  },

  latest: {
    eyebrow: { en: "Latest report", fr: "Dernier rapport" },
    headline: {
      en: "A closer look at our progress.",
      fr: "Un regard plus attentif sur nos progrès.",
    },
    emptyState: {
      en: "Our next report will be published here.",
      fr: "Notre prochain rapport sera publié ici.",
    },
    viewLabel: { en: "Read report", fr: "Lire le rapport" },
    downloadLabel: { en: "Download PDF", fr: "Télécharger le PDF" },
  },

  reports: {
    eyebrow: { en: "Our reports", fr: "Nos rapports" },
    headline: {
      en: "Following our progress over time.",
      fr: "Suivre nos progrès dans la durée.",
    },
    intro: {
      en: "We report at key points throughout the year to help our community, partners and funders understand what we are doing, what is changing and how our organisation is developing.",
      fr: "Nous publions des rapports à des moments clés de l'année afin d'aider notre communauté, nos partenaires et nos financeurs à comprendre ce que nous faisons, ce qui évolue et comment notre organisation se développe.",
    },
    // A group is only rendered when a report of that category exists, so
    // nothing here promises a document that has not been published.
    groups: [
      {
        category: "annual",
        title: { en: "Annual reports", fr: "Rapports annuels" },
        description: {
          en: "Our annual reports bring together programme delivery, participant outcomes, organisational milestones, partnerships, finances, challenges and the lessons shaping our next year of work.",
          fr: "Nos rapports annuels réunissent la mise en œuvre des programmes, les résultats des participants, les étapes organisationnelles, les partenariats, les finances, les difficultés et les enseignements qui façonnent l'année suivante.",
        },
      },
      {
        category: "midYear",
        title: { en: "Mid-year progress reports", fr: "Rapports de mi-parcours" },
        description: {
          en: "A shorter view of programme implementation, progress against priorities and key organisational developments during the period.",
          fr: "Une vue plus concise de la mise en œuvre des programmes, des progrès réalisés et des principales évolutions de l'organisation sur la période.",
        },
      },
      {
        category: "financial",
        title: { en: "Financial reports", fr: "Rapports financiers" },
        description: {
          en: "Information on the resources entrusted to Impact Axis, where our funding comes from and how it is used to support our mission and programmes.",
          fr: "Des informations sur les ressources confiées à Impact Axis, l'origine de nos financements et la manière dont ils soutiennent notre mission et nos programmes.",
        },
      },
    ],
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
