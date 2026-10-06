import type { HeroConfig } from "@/components/sections/home-hero/types";

export const heroConfig: HeroConfig = {
  activeHero: "learning-earning",
  heroes: {
    "learning-earning": {
      type: "learning-earning",
      headline: { en: "From learning to earning.", fr: "De l'apprentissage à l'emploi." },
      eyebrow: { en: "Impact Axis · Cameroon", fr: "Impact Axis · Cameroun" },
      lead: { en: "From learning", fr: "De l'apprentissage" },
      connector: { en: "to", fr: "" },
      words: [
        {
          text: { en: "doing.", fr: "à l'action." },
          image: "/images/focus-applied-learning.jpg",
          position: "60% 40%",
        },
        {
          text: { en: "building.", fr: "à la création." },
          image: "/images/focus-digital-ai.jpg",
          position: "60% 35%",
        },
        {
          text: { en: "leading.", fr: "au leadership." },
          image: "/images/gallery/hive-001-30.jpg",
          position: "50% 30%",
          flip: true,
        },
        {
          text: { en: "earning.", fr: "à l'emploi." },
          image: "/images/gallery/gwf-2026-34.jpg",
          position: "65% 30%",
        },
      ],
      description: {
        en: "We give young Cameroonians the skills, experience and mentors employers look for.",
        fr: "Nous donnons aux jeunes Camerounais les compétences, l'expérience et les mentors que recherchent les employeurs.",
      },
      paths: [
        {
          kicker: { en: "I'm a young person", fr: "Je suis un·e jeune" },
          title: { en: "Find a programme", fr: "Trouver un programme" },
          label: { en: "See our programmes", fr: "Voir nos programmes" },
          href: "/what-we-do",
        },
        {
          kicker: { en: "We're an organisation", fr: "Nous sommes une organisation" },
          title: { en: "Fund, hire or mentor", fr: "Financer, recruter ou mentorer" },
          label: { en: "Partner with us", fr: "Devenir partenaire" },
          href: "/work-with-us",
        },
      ],
      proof: [
        { value: "450+", label: { en: "young people reached", fr: "jeunes accompagnés" } },
        { value: "$1.5M+", label: { en: "in opportunities unlocked", fr: "d'opportunités débloquées" } },
        {
          value: "55%",
          label: { en: "reach an opportunity in 6 months", fr: "accèdent à une opportunité en 6 mois" },
        },
      ],
    },
    "promo-card": {
      type: "promo-card",
      backgroundImages: ["/images/team-1.jpg", "/images/alumni-1.jpg", "/images/girls-2.jpg"],
      headline: {
        en: "We build the systems that unlock Africa's boundless potential",
        fr: "Nous construisons les systèmes qui libèrent le potentiel illimité de l'Afrique",
      },
      seeAllStoriesButton: {
        label: { en: "See all stories", fr: "Voir toutes les histoires" },
        href: "/blog",
      },
      card: {
        badgeLabel: { en: "📢 Applications open", fr: "📢 Candidatures ouvertes" },
        image: "/images/alumni-1.jpg",
        title: {
          en: "Apply for the 4th cohort of the goodwill fellowship program",
          fr: "Postulez pour la 4e cohorte du programme de bourses goodwill",
        },
        dateLine: {
          en: "Applications end on june 25th, 2026",
          fr: "Les candidatures se terminent le 25 juin 2026",
        },
        applyButton: {
          label: { en: "Apply now", fr: "Postuler" },
          href: "/what-we-do",
        },
        learnMoreButton: {
          label: { en: "Learn more", fr: "En savoir plus" },
          href: "/what-we-do",
        },
      },
    },
    "overlay-welcome": {
      type: "overlay-welcome",
      backgroundImages: ["/images/girls-2.jpg", "/images/alumni-1.jpg", "/images/team-1.jpg"],
      eyebrow: { en: "Welcome", fr: "Bienvenue" },
      headline: {
        en: "We build the systems that unlock Africa's potential",
        fr: "Nous construisons les systèmes qui libèrent le potentiel de l'Afrique",
      },
      headlineEmphasis: {
        en: "one young person at a time.",
        fr: "une jeune personne à la fois.",
      },
      seeAllStoriesButton: {
        label: { en: "See all stories", fr: "Voir toutes les histoires" },
        href: "/blog",
      },
    },
    "collage-dark": {
      type: "collage-dark",
      headline: {
        en: "Building the bridge from education to meaningful work.",
        fr: "Construire le pont entre l'éducation et un travail porteur de sens.",
      },
      seeAllStoriesButton: {
        label: { en: "Explore our work", fr: "Découvrir notre travail" },
        href: "/what-we-do",
      },
      collageImages: ["/images/girls-1.jpg", "/images/team-1.jpg", "/images/alumni-1.jpg"],
    },
    "collage-description": {
      type: "collage-description",
      headline: {
        en: "Building the bridge from education to meaningful work.",
        fr: "Construire le pont entre l'éducation et un travail porteur de sens.",
      },
      description: {
        en: "Impact Axis is a Cameroon-based nonprofit helping young people build the practical skills, experience and networks they need to access meaningful and dignified work. We do this through experiential learning, mentorship and applied projects.",
        fr: "Impact Axis est une organisation à but non lucratif basée au Cameroun qui aide les jeunes à développer les compétences pratiques, l'expérience et les réseaux dont ils ont besoin pour accéder à un travail significatif et digne. Nous y parvenons par l'apprentissage expérientiel, le mentorat et des projets appliqués.",
      },
      seeAllStoriesButton: {
        label: { en: "Explore our work", fr: "Découvrir notre travail" },
        href: "/what-we-do",
      },
      collageImages: ["/images/girls-1.jpg", "/images/team-1.jpg", "/images/alumni-1.jpg"],
    },
    "fullbleed-overlay": {
      type: "fullbleed-overlay",
      backgroundImages: ["/images/team-1.jpg", "/images/alumni-1.jpg", "/images/girls-2.jpg"],
      headlineSegments: {
        en: [
          { text: "We build the " },
          { chip: "icon-static", icons: ["partners", "funders", "ecosystem", "talented"], color: "icon-peach", width: "8vw", height: "4vw" },
          { text: " systems that " },
          { text: "unlock", emphasis: true },
          { chip: "icon", icons: ["ecosystem", "talented", "partners", "funders"], color: "icon-green", width: "4vw", height: "4vw" },
          { text: " Africa's boundless " },
          {
            chip: "image",
            src: ["/images/girls-2.jpg", "/images/alumni-1.jpg", "/images/team-1.jpg"],
            width: "8vw",
            height: "4.5vw",
          },
          { text: " " },
          { text: "potential", emphasis: true },
        ],
        fr: [
          { text: "Nous construisons les " },
          { chip: "icon-static", icons: ["partners", "funders", "ecosystem", "talented"], color: "icon-peach", width: "8vw", height: "4vw" },
          { text: " systèmes qui " },
          { text: "libèrent", emphasis: true },
          { chip: "icon", icons: ["ecosystem", "talented", "partners", "funders"], color: "icon-green", width: "4vw", height: "4vw" },
          { text: " le " },
          { text: "potentiel illimité", emphasis: true },
          { text: " " },
          {
            chip: "image",
            src: ["/images/girls-2.jpg", "/images/alumni-1.jpg", "/images/team-1.jpg"],
            width: "8vw",
            height: "4.5vw",
          },
          { text: " de l'Afrique" },
        ],
      },
      seeAllStoriesButton: {
        label: { en: "See all stories", fr: "Voir toutes les histoires" },
        href: "/blog",
      },
    },
  },
};
