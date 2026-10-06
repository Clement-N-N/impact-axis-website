import type { WhoWeServeContent } from "./types";

export const whoWeServeContent: WhoWeServeContent = {
  eyebrow: { en: "Who We Work With", fr: "Avec qui nous travaillons" },
  cards: [
    {
      icon: "/icons/young_people 1.svg",
      number: "01",
      label: { en: "Young People", fr: "Jeunes" },
      description: {
        en: "Build practical skills, gain real-world experience and access the mentorship and networks needed to move into meaningful work.",
        fr: "Développez des compétences pratiques, acquérez une expérience concrète et accédez au mentorat et aux réseaux nécessaires pour accéder à un travail porteur de sens.",
      },
    },
    {
      icon: "/icons/organizations 1.svg",
      number: "02",
      label: { en: "Funding & Development Partners", fr: "Partenaires de financement et de développement" },
      description: {
        en: "Fund and scale youth workforce programmes that expand access to opportunity and deliver measurable outcomes for young people.",
        fr: "Financez et développez à grande échelle des programmes d'employabilité des jeunes qui élargissent l'accès aux opportunités et produisent des résultats mesurables pour les jeunes.",
      },
    },
    {
      icon: "/icons/icon-organisations 1.svg",
      number: "03",
      label: { en: "Employers & Education Partners", fr: "Employeurs et partenaires éducatifs" },
      description: {
        en: "Co-create practical pathways that connect young people with workplace exposure, mentorship and meaningful opportunities.",
        fr: "Co-créez des parcours concrets qui connectent les jeunes à une exposition au monde du travail, à du mentorat et à des opportunités porteuses de sens.",
      },
    },
  ],
};

/**
 * Section copy kept in code rather than Sanity: the headline, and where each
 * card leads (in card order: young people, funders, employers & educators).
 */
export const whoWeServeChrome = {
  headline: {
    en: "Three groups, one goal: young people in work.",
    fr: "Trois publics, un seul objectif : l'emploi des jeunes.",
  },
  links: [
    {
      href: "/what-we-do",
      label: { en: "See our programmes", fr: "Voir nos programmes" },
    },
    {
      href: "/work-with-us/funders-development-partners",
      label: { en: "Partner as a funder", fr: "Devenir partenaire financier" },
    },
    {
      href: "/work-with-us",
      label: { en: "Partner with us", fr: "Devenir partenaire" },
    },
  ],
};
