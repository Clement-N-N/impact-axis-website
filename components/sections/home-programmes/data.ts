import type { LocalizedText } from "@/components/sections/home-hero/types";

/** Home-page framing for the programme preview; the programmes themselves
 *  come from the What We Do content so there is one source for them. */
export const homeProgrammesCopy: {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  cta: LocalizedText;
  all: LocalizedText;
} = {
  eyebrow: { en: "Our programmes", fr: "Nos programmes" },
  headline: {
    en: "Three programmes. One pathway into work.",
    fr: "Trois programmes. Un seul chemin vers l'emploi.",
  },
  intro: {
    en: "Each one builds the skills, experience and connections young people carry into their first job and beyond.",
    fr: "Chacun développe les compétences, l'expérience et les relations que les jeunes emportent dans leur premier emploi, et au-delà.",
  },
  cta: { en: "Explore the programme", fr: "Découvrir le programme" },
  all: { en: "See all our work", fr: "Voir tout notre travail" },
};
