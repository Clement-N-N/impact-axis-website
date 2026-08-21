import type { HomeFaqContent } from "./types";

export const homeFaqChrome: Pick<
  HomeFaqContent,
  "eyebrow" | "stillHaveQuestionsHeading" | "contactButton"
> = {
  eyebrow: {
    en: "Frequently Asked Questions",
    fr: "Foire aux questions",
  },
  stillHaveQuestionsHeading: {
    en: "Still have questions?",
    fr: "Vous avez d'autres questions?",
  },
  contactButton: {
    label: {
      en: "Contact us",
      fr: "Contactez-nous",
    },
    href: "/contact",
  },
};
