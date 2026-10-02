import type { Metadata } from "next";
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
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
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

/** Meta descriptions: 140–155 characters, the page's facts first. */
export const PAGE_DESCRIPTIONS = {
  home: {
    en: "Impact Axis is a Cameroon-based nonprofit that gives young people the skills, experience and mentors employers look for, and connects them to real work.",
    fr: "Impact Axis est une ONG camerounaise qui donne aux jeunes les compétences, l'expérience et les mentors attendus par les employeurs, et les relie à l'emploi.",
  },
  whatWeDo: {
    en: "Career readiness programmes in Cameroon: practical skills, work experience, mentoring and The Hive, built to move young people from school into work.",
    fr: "Programmes d'employabilité au Cameroun : compétences pratiques, expérience professionnelle, mentorat et The Hive, pour passer de l'école à l'emploi.",
  },
  about: {
    en: "Founded in 2021, Impact Axis is a Cameroonian nonprofit closing the gap between education and work. Meet our team and see how our approach works.",
    fr: "Fondée en 2021, Impact Axis est une ONG camerounaise qui rapproche l'éducation et l'emploi. Découvrez notre équipe, notre histoire et notre approche.",
  },
  impact: {
    en: "450+ young people reached, $1.5M+ in opportunities unlocked and 55% in an opportunity within six months. Read our results and annual reports.",
    fr: "Plus de 450 jeunes touchés, plus de 1,5 M$ d'opportunités débloquées et 55 % en opportunité sous six mois. Lisez nos résultats et rapports annuels.",
  },
  workWithUs: {
    en: "Partner with Impact Axis as a funder, employer, school or mentor. See what we have done so far, how partnering works, and hear back in two working days.",
    fr: "Devenez partenaire d'Impact Axis comme financeur, employeur, établissement ou mentor. Voyez nos résultats et recevez une réponse sous deux jours ouvrés.",
  },
  contact: {
    en: "Contact Impact Axis in Yaoundé about partnerships, programmes, mentoring or media. Email info@impact-axis.org and we reply within two working days.",
    fr: "Contactez Impact Axis à Yaoundé pour un partenariat, un programme, du mentorat ou la presse. Écrivez à info@impact-axis.org, réponse sous deux jours ouvrés.",
  },
  events: {
    en: "Career fairs, workshops and mentoring sessions for young people in Cameroon. See upcoming Impact Axis events, who is speaking and how to register.",
    fr: "Salons de l'emploi, ateliers et sessions de mentorat pour les jeunes au Cameroun. Découvrez les prochains événements Impact Axis et comment s'inscrire.",
  },
  blog: {
    en: "Insights on youth employment, skills and the future of work in Cameroon and Africa, plus programme updates and stories from the young people we work with.",
    fr: "Analyses sur l'emploi des jeunes, les compétences et l'avenir du travail au Cameroun et en Afrique, avec nos actualités et des témoignages de jeunes.",
  },
  privacy: {
    en: "How Impact Axis collects, uses and protects your personal data when you visit our website, contact us or take part in one of our programmes.",
    fr: "Comment Impact Axis collecte, utilise et protège vos données personnelles lorsque vous visitez notre site, nous contactez ou rejoignez un programme.",
  },
  terms: {
    en: "The terms that apply when you use the Impact Axis website, including acceptable use, intellectual property and how to reach us with questions.",
    fr: "Les conditions qui s'appliquent à l'utilisation du site Impact Axis : usage acceptable, propriété intellectuelle et comment nous joindre.",
  },
} satisfies Record<keyof typeof PAGE_TITLES, Text>;

export const blogCategoryTitle = (category: string, locale: Locale) =>
  locale === "fr"
    ? `${cleanTitle(category)} - Articles du blog`
    : `${cleanTitle(category)} - Blog Articles`;

const loc = (locale: string): Locale => (locale === "fr" ? "fr" : "en");

export const pageTitle = (key: keyof typeof PAGE_TITLES, locale: string) =>
  PAGE_TITLES[key][loc(locale)];

/**
 * Canonical plus hreflang for a path (without the locale prefix). x-default
 * points search engines at English for visitors who read neither language.
 */
export function alternatesFor(path: string, locale: string): Metadata["alternates"] {
  return {
    canonical: `${BASE_URL}/${loc(locale)}${path}`,
    languages: {
      en: `${BASE_URL}/en${path}`,
      fr: `${BASE_URL}/fr${path}`,
      "x-default": `${BASE_URL}/en${path}`,
    },
  };
}

/** Branded 1200×630 share card with the page title on it (app/api/og). */
export function ogCard(title: string) {
  const q = new URLSearchParams({ title });
  return { url: `/api/og?${q}`, width: 1200, height: 630, alt: withBrand(title) };
}

/**
 * Full metadata for a page: tab title, description, canonical/hreflang and
 * matching Open Graph + Twitter cards. `image` replaces the generated card
 * (blog posts use their cover photo).
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  absolute = false,
  type = "website",
  image,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  /** Home: the layout's template doesn't reach a page in its own segment. */
  absolute?: boolean;
  type?: "website" | "article";
  image?: { url: string; alt: string };
}): Metadata {
  const full = withBrand(title);
  const alternates = alternatesFor(path, locale);
  const card = image ?? ogCard(title);
  return {
    title: absolute ? { absolute: full } : title,
    description,
    alternates,
    openGraph: {
      title: full,
      description,
      url: `${BASE_URL}/${loc(locale)}${path}`,
      siteName: SITE_NAME,
      locale: loc(locale) === "fr" ? "fr_FR" : "en_US",
      alternateLocale: loc(locale) === "fr" ? "en_US" : "fr_FR",
      type,
      images: [card],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [card.url],
    },
  };
}

/** pageMetadata for a page whose title and description live in this file. */
export const staticPageMetadata = (
  key: keyof typeof PAGE_TITLES,
  path: string,
  locale: string,
) =>
  pageMetadata({
    locale,
    path,
    title: PAGE_TITLES[key][loc(locale)],
    description: PAGE_DESCRIPTIONS[key][loc(locale)],
    absolute: key === "home",
  });
