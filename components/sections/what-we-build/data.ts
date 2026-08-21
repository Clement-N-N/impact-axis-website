import type { WhatWeBuildContent } from "./types";

export const whatWeBuildContent: WhatWeBuildContent = {
  overlay: {
    eyebrow: { en: "What We Build", fr: "Ce que nous construisons" },
    headline: {
      en: "A practical pathway from learning to work.",
      fr: "Un parcours concret de l'apprentissage vers l'emploi.",
    },
    backgroundImage: "/images/alumni-2.png",
  },
  slides: [
    {
      legendLabel: { en: "Skills for Work", fr: "Compétences pour le travail" },
      headline: { en: "Skills for Work", fr: "Compétences pour le travail" },
      description: {
        en: "Experiential learning that develops the communication, problem-solving, teamwork, digital fluency and self-leadership skills young people need to navigate the workplace.",
        fr: "Un apprentissage expérientiel qui développe la communication, la résolution de problèmes, le travail d'équipe, l'aisance numérique et le leadership personnel dont les jeunes ont besoin pour évoluer en milieu professionnel.",
      },
      image: "/images/alumni-3.png",
      button: { label: { en: "Explore our programmes", fr: "Découvrir nos programmes" }, href: "/programs" },
    },
    {
      legendLabel: { en: "Experience That Builds Confidence", fr: "Une expérience qui renforce la confiance" },
      headline: { en: "Experience That Builds Confidence", fr: "Une expérience qui renforce la confiance" },
      description: {
        en: "Projects, simulations and real-world challenges give young people opportunities to apply what they learn, solve problems and build evidence of what they can do.",
        fr: "Des projets, des simulations et des mises en situation réelles donnent aux jeunes l'occasion d'appliquer ce qu'ils apprennent, de résoudre des problèmes et de démontrer concrètement ce dont ils sont capables.",
      },
      image: "/images/alumni-4.png",
      button: { label: { en: "See our approach", fr: "Découvrir notre approche" }, href: "/about" },
    },
    {
      legendLabel: { en: "Connections to Opportunity", fr: "Des connexions vers l'opportunité" },
      headline: { en: "Connections to Opportunity", fr: "Des connexions vers l'opportunité" },
      description: {
        en: "Mentorship, career guidance, professional networks and employer exposure help young people understand their options, build relationships and access meaningful opportunities.",
        fr: "Le mentorat, l'orientation professionnelle, les réseaux professionnels et l'exposition aux employeurs aident les jeunes à comprendre leurs options, à tisser des relations et à accéder à des opportunités porteuses de sens.",
      },
      image: "/images/alumni-5.png",
      button: { label: { en: "Discover the pathway", fr: "Découvrir le parcours" }, href: "/programs" },
    },
  ],
};
