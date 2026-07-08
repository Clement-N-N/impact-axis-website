import type { WhoWeServeContent } from "./types";

export const whoWeServeContent: WhoWeServeContent = {
  eyebrow: { en: "Who We Serve", fr: "Qui nous servons" },
  cards: [
    {
      icon: "/icons/young_people 1.svg",
      number: "01",
      label: { en: "For Young People", fr: "Pour les jeunes" },
      description: {
        en: "Our model mirrors real work environments, enabling young people to build the skills, judgment, and professional confidence employers value.",
        fr: "Notre modèle reproduit des environnements de travail réels, permettant aux jeunes de développer les compétences, le jugement et la confiance professionnelle que les employeurs recherchent.",
      },
    },
    {
      icon: "/icons/organizations 1.svg",
      number: "02",
      label: { en: "For Organisations", fr: "Pour les organisations" },
      description: {
        en: "Design talent systems and employability pipelines that create measurable impact.",
        fr: "Concevez des systèmes de talents et des parcours d'employabilité qui créent un impact mesurable.",
      },
    },
    {
      icon: "/icons/icon-organisations 1.svg",
      number: "03",
      label: { en: "For Ecosystem Builders", fr: "Pour les bâtisseurs d'écosystèmes" },
      description: {
        en: "Collaborate on systems-level intervention that transforms education and employment.",
        fr: "Collaborez à des interventions systémiques qui transforment l'éducation et l'emploi.",
      },
    },
  ],
};
