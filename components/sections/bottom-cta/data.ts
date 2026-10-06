import type { BottomCtaContent } from "./types";

export const bottomCtaContent: BottomCtaContent = {
  block: {
    image: "/images/girls-2.jpg",
    accentColor: "#121E6E",
    title: {
      en: "Ready to start a conversation with us?",
      fr: "Prêt à entamer une conversation avec nous ?",
    },
    button: {
      label: { en: "Get in touch", fr: "Contactez-nous" },
      href: "/contact",
    },
    buttonVariant: "white",
  },
};

/** Supporting copy for the closing band, kept in code (not in Sanity). */
export const bottomCtaChrome = {
  note: {
    en: "Tell us what you have in mind. We reply within two working days.",
    fr: "Dites-nous ce que vous avez en tête. Nous répondons sous deux jours ouvrés.",
  },
  secondary: {
    label: { en: "Or see ways to partner", fr: "Ou découvrez comment collaborer" },
    href: "/work-with-us",
  },
};
