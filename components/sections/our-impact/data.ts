import type { ImpactCardDesign, OurImpactChrome } from "./types";

export const ourImpactChrome: OurImpactChrome = {
  eyebrow: { en: "Our Impact", fr: "Notre impact" },
  paragraph: {
    en: "We measure progress by what young people can do next. Our impact goes beyond participation — we track whether young people build stronger capabilities, access meaningful opportunities and leave our programmes better positioned for work and life.",
    fr: "Nous mesurons les progrès à travers ce que les jeunes sont capables de faire ensuite. Notre impact va au-delà de la simple participation — nous suivons si les jeunes développent des compétences plus fortes, accèdent à des opportunités porteuses de sens et terminent nos programmes mieux préparés pour le travail et la vie.",
  },
  reportCta: {
    en: "Explore our impact",
    fr: "Découvrir notre impact",
  },
};

// Card visuals are fixed design, not editorial content — they aren't stored in
// Sanity. Stats are mapped onto these designs by position; if there are more
// stats than designs, the designs repeat in sequence.
export const IMPACT_CARD_DESIGNS: ImpactCardDesign[] = [
  {
    image: "/images/placeholder_image_1.png",
    background: "linear-gradient(180deg, rgba(250,177,160,0.3) 0%, rgba(247,136,110,0.5) 100%)",
  },
  {
    image: "/images/placeholder_image.png",
    background: "linear-gradient(180deg, rgba(255,234,167,0.3) 0%, rgba(255,222,117,0.5) 100%)",
  },
  {
    image: "/images/placeholder_image_4.png",
    background: "linear-gradient(180deg, rgba(167,255,180,0.3) 0%, rgba(117,255,138,0.5) 100%)",
  },
  {
    image: "/images/placeholder_image_3.png",
    background: "linear-gradient(180deg, rgba(116,185,255,0.3) 0%, rgba(66,160,255,0.5) 100%)",
  },
  {
    image: "/images/placeholder_image_2.png",
    background: "linear-gradient(180deg, rgba(220,116,255,0.3) 0%, rgba(208,66,255,0.5) 100%)",
  },
  {
    image: "/images/placeholder_image_2.png",
    background: "linear-gradient(180deg, rgba(255,218,167,0.3) 0%, rgba(255,198,117,0.5) 100%)",
  },
];
