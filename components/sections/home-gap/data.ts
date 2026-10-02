import type { HomeGapContent } from "./types";

/**
 * The home page's "Why we exist" and "Our solution" as one section: the
 * gap young people face, and how Impact Axis closes it. The longer story
 * lives on the About page.
 */
export const homeGapContent: HomeGapContent = {
  problemEyebrow: { en: "The gap", fr: "Le fossé" },
  problem: {
    en: "Young Cameroonians are finishing school without a clear path to meaningful and dignified work.",
    fr: "Les jeunes Camerounais terminent leurs études sans chemin clair vers un travail digne et porteur de sens.",
  },
  solutionEyebrow: { en: "How we close it", fr: "Comment nous le comblons" },
  solution: {
    en: "We help them build the growth-focused, industry-neutral skills they need to land meaningful and dignified opportunities.",
    fr: "Nous les aidons à développer des compétences tournées vers la croissance, valables dans tous les secteurs, pour accéder à des opportunités dignes et porteuses de sens.",
  },
  counter: { en: "{n} / {total} closed", fr: "{n} / {total} comblés" },
  pairs: [
    {
      gap: {
        en: "Skills school doesn't teach",
        fr: "Des compétences que l'école n'enseigne pas",
      },
      answer: { en: "Experiential learning", fr: "Apprentissage expérientiel" },
    },
    {
      gap: { en: "No chance to practise", fr: "Aucune occasion de pratiquer" },
      answer: { en: "Applied projects", fr: "Projets appliqués" },
    },
    {
      gap: { en: "Navigating it alone", fr: "Avancer seuls" },
      answer: { en: "Mentorship", fr: "Mentorat" },
    },
    {
      gap: {
        en: "No one to open doors",
        fr: "Personne pour ouvrir des portes",
      },
      answer: { en: "Professional networks", fr: "Réseaux professionnels" },
    },
  ],
  button: {
    label: { en: "Explore our approach", fr: "Découvrir notre approche" },
    href: "/about",
  },
};
