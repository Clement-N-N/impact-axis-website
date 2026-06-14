import type { HeroConfig } from "@/components/sections/home-hero/types";

export const heroConfig: HeroConfig = {
  activeHero: "fullbleed-overlay",
  heroes: {
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
          href: "/programs",
        },
        learnMoreButton: {
          label: { en: "Learn more", fr: "En savoir plus" },
          href: "/programs",
        },
      },
    },
    "overlay-welcome": {
      type: "overlay-welcome",
      backgroundImages: ["/images/girls-2.jpg", "/images/alumni-1.jpg", "/images/team-1.jpg"],
      eyebrow: { en: "Welcome", fr: "Bienvenue" },
      headline: {
        en: "We build the systems that unlock Africa's boundless potential",
        fr: "Nous construisons les systèmes qui libèrent le potentiel illimité de l'Afrique",
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
        en: "We build the systems that unlock Africa's boundless potential",
        fr: "Nous construisons les systèmes qui libèrent le potentiel illimité de l'Afrique",
      },
      seeAllStoriesButton: {
        label: { en: "See all stories", fr: "Voir toutes les histoires" },
        href: "/blog",
      },
      collageImages: ["/images/girls-1.jpg", "/images/team-1.jpg", "/images/alumni-1.jpg"],
    },
    "collage-description": {
      type: "collage-description",
      headline: {
        en: "We build the systems that unlock Africa's boundless potential",
        fr: "Nous construisons les systèmes qui libèrent le potentiel illimité de l'Afrique",
      },
      description: {
        en: "We design experiential learning, leadership development, and enterprise pathways that prepare people for meaningful work in a fast-changing world.",
        fr: "Nous concevons l'apprentissage expérientiel, le développement du leadership et des parcours entrepreneuriaux qui préparent les gens à un travail significatif dans un monde en mutation rapide.",
      },
      seeAllStoriesButton: {
        label: { en: "See all stories", fr: "Voir toutes les histoires" },
        href: "/blog",
      },
      collageImages: ["/images/girls-1.jpg", "/images/team-1.jpg", "/images/alumni-1.jpg"],
    },
    "fullbleed-overlay": {
      type: "fullbleed-overlay",
      backgroundImages: ["/images/team-1.jpg", "/images/alumni-1.jpg", "/images/girls-2.jpg"],
      headlineSegments: {
        en: [
          { text: "We build the " },
          { chip: "icon-static", icons: ["ecosystem"], color: "icon-peach", width: "8vw", height: "4vw" },
          { text: " systems that " },
          { text: "unlock", emphasis: true },
          { chip: "icon", icons: ["funders"], color: "icon-green", width: "4vw", height: "4vw" },
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
          { chip: "icon-static", icons: ["ecosystem"], color: "icon-peach", width: "8vw", height: "4vw" },
          { text: " systèmes qui " },
          { text: "libèrent", emphasis: true },
          { chip: "icon", icons: ["funders"], color: "icon-green", width: "4vw", height: "4vw" },
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
