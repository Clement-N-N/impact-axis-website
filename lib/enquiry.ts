import type { Locale } from "@/i18n/routing";

/**
 * Shared shape and copy for the site's enquiry forms (Contact and the four
 * Work With Us audience forms). Safe to import from client and server.
 */

/** Which form sent it: "contact" or a Work With Us audience slug. */
export type EnquirySource =
  | "contact"
  | "funders-development-partners"
  | "employers-corporate-partners"
  | "education-training-institutions"
  | "mentors-professionals";

export type EnquiryPayload = {
  source: EnquirySource;
  locale: Locale;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  /** Contact page topic id, or the audience page's fixed subject. */
  subject: string;
  message: string;
  /** Ticked the "keep me posted" box. */
  newsletter: boolean;
  /** Honeypot: hidden from people, filled in by bots. Must be empty. */
  website?: string;
  /** Milliseconds between the form appearing and being sent. */
  elapsed?: number;
};

type Text = Record<Locale, string>;

/** Short audience names used to tag contacts in Brevo. */
export const SOURCE_TAG: Record<EnquirySource, string> = {
  contact: "General",
  "funders-development-partners": "Funders",
  "employers-corporate-partners": "Employers",
  "education-training-institutions": "Educators",
  "mentors-professionals": "Mentors",
};

/** What the "keep me posted" box promises, per form. */
const OPT_IN_TOPIC: Record<EnquirySource, Text> = {
  contact: {
    en: "news and upcoming events",
    fr: "actualités et prochains événements",
  },
  "funders-development-partners": {
    en: "impact reports and funding updates",
    fr: "rapports d'impact et actualités de financement",
  },
  "employers-corporate-partners": {
    en: "hiring events and talent updates",
    fr: "événements de recrutement et profils de talents",
  },
  "education-training-institutions": {
    en: "programme and partnership news",
    fr: "actualités des programmes et partenariats",
  },
  "mentors-professionals": {
    en: "mentoring opportunities",
    fr: "opportunités de mentorat",
  },
};

export function optInCopy(source: EnquirySource, locale: Locale) {
  const topic = OPT_IN_TOPIC[source][locale];
  return locale === "fr"
    ? {
        title: "Tenez-moi informé·e.",
        body: `Recevez nos ${topic}, environ une fois par mois. Désinscription à tout moment.`,
        privacy: "Utilisation de vos données",
      }
    : {
        title: "Keep me posted.",
        body: `Send me Impact Axis ${topic}, about once a month. Unsubscribe anytime.`,
        privacy: "How we use your data",
      };
}

export const ENQUIRY_STATUS: Record<"error" | "unavailable", Text> = {
  error: {
    en: "Sorry, your message didn't send. Please try again, or email us at info@impact-axis.org.",
    fr: "Désolé, votre message n'a pas été envoyé. Réessayez ou écrivez-nous à info@impact-axis.org.",
  },
  unavailable: {
    en: "Our form is briefly unavailable. Please email us at info@impact-axis.org.",
    fr: "Notre formulaire est momentanément indisponible. Écrivez-nous à info@impact-axis.org.",
  },
};
