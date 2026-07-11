import type { BottomCtaContent } from "./types";

export const bottomCtaContent: BottomCtaContent = {
  blocks: [
    {
      image: "/images/team-1.jpg",
      accentColor: "#121E6E",
      title: {
        en: "Interested in how these systems could work for your context?",
        fr: "Vous voulez savoir comment ces systèmes pourraient s'appliquer à votre contexte ?",
      },
      button: {
        label: { en: "Partner with us", fr: "Devenez partenaire" },
        href: "#",
      },
      buttonVariant: "white",
    },
    {
      image: "/images/girls-2.jpg",
      accentColor: "#806700",
      title: {
        en: "Ready to start a conversation with us?",
        fr: "Prêt à entamer une conversation avec nous ?",
      },
      button: {
        label: { en: "Get in touch", fr: "Contactez-nous" },
        href: "#",
      },
      buttonVariant: "primary",
    },
  ],
};
