import type { Locale } from "@/i18n/routing";

/**
 * Browser-tab and search titles.
 *
 * Every title follows `<page title> | Impact Axis`. The layout applies
 * TITLE_TEMPLATE to each page's `title`; Open Graph and Twitter titles don't
 * inherit it, so pages build those with `withBrand()`.
 *
 * Rules for the page part:
 * - Most descriptive words first: tabs cut off around 30 characters.
 * - Whole title under about 60 characters (what search results show).
 * - Divide with `-` only (the brand gets `|`). No commas, colons or emojis.
 */
export const SITE_NAME = "Impact Axis";
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

export const withBrand = (title: string) => TITLE_TEMPLATE.replace("%s", title);

/**
 * Makes CMS text (blog post and category titles) fit the rules: dashes,
 * colons and other separators become ` - `, commas and emojis are dropped.
 */
export function cleanTitle(text: string): string {
  return text
    .replace(/\p{Extended_Pictographic}|️|‍/gu, "")
    .replace(/\s*[—–:|·]\s*/g, " - ")
    .replace(/,/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s-]+|[\s-]+$/g, "");
}

type Text = Record<Locale, string>;

/** Page part of each title, before ` | Impact Axis`. */
export const PAGE_TITLES = {
  home: {
    en: "Youth Employability Programmes in Cameroon",
    fr: "Employabilité des jeunes au Cameroun",
  },
  whatWeDo: {
    en: "Career Readiness Programmes - Cameroon",
    fr: "Programmes d'employabilité - Cameroun",
  },
  about: {
    en: "About Us - Youth Employability Nonprofit",
    fr: "À propos - ONG pour l'emploi des jeunes",
  },
  impact: {
    en: "Our Impact - Youth Employment Outcomes",
    fr: "Notre impact - Insertion des jeunes",
  },
  workWithUs: {
    en: "Partner With Us - Youth Programmes Cameroon",
    fr: "Devenir partenaire - Jeunesse au Cameroun",
  },
  contact: {
    en: "Contact Us - Partnerships and Programmes",
    fr: "Nous contacter - Partenariats et programmes",
  },
  events: {
    en: "Youth Career Events and Workshops - Cameroon",
    fr: "Événements et ateliers jeunesse - Cameroun",
  },
  blog: {
    en: "Youth Employment Insights - Blog and News",
    fr: "Emploi des jeunes - Blog et actualités",
  },
  programs: {
    en: "Youth Programmes - Skills and Mentoring",
    fr: "Programmes jeunesse - Compétences et mentorat",
  },
  privacy: {
    en: "Privacy Policy - How We Use Your Data",
    fr: "Confidentialité - Utilisation de vos données",
  },
  terms: {
    en: "Terms of Use - Website Rules",
    fr: "Conditions d'utilisation du site",
  },
} satisfies Record<string, Text>;

/** One per Work With Us audience page, keyed by its slug. */
export const AUDIENCE_TITLES: Record<string, Text> = {
  "funders-development-partners": {
    en: "Fund Youth Programmes - Development Partners",
    fr: "Financer l'emploi des jeunes - Bailleurs",
  },
  "employers-corporate-partners": {
    en: "Hire Job-Ready Graduates - Employer Partners",
    fr: "Recruter de jeunes talents - Employeurs",
  },
  "education-training-institutions": {
    en: "Career Training Partners - Universities",
    fr: "Partenariats emploi - Écoles et universités",
  },
  "mentors-professionals": {
    en: "Mentor Young Talent - 2 Hours a Week",
    fr: "Mentorer de jeunes talents - 2 h par semaine",
  },
};

export const blogCategoryTitle = (category: string, locale: Locale) =>
  locale === "fr"
    ? `${cleanTitle(category)} - Articles du blog`
    : `${cleanTitle(category)} - Blog Articles`;

export const pageTitle = (key: keyof typeof PAGE_TITLES, locale: string) =>
  PAGE_TITLES[key][locale === "fr" ? "fr" : "en"];
