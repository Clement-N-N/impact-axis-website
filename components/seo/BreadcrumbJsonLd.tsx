"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { BASE_URL } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** Short crumb names per path segment; unknown slugs are humanised. */
const NAMES: Record<string, Record<Locale, string>> = {
  "": { en: "Home", fr: "Accueil" },
  about: { en: "About", fr: "À propos" },
  "what-we-do": { en: "What We Do", fr: "Ce que nous faisons" },
  impact: { en: "Impact", fr: "Impact" },
  "work-with-us": { en: "Work With Us", fr: "Travailler avec nous" },
  "funders-development-partners": { en: "Funders", fr: "Financeurs" },
  "employers-corporate-partners": { en: "Employers", fr: "Employeurs" },
  "education-training-institutions": { en: "Educators", fr: "Établissements" },
  "mentors-professionals": { en: "Mentors", fr: "Mentors" },
  contact: { en: "Contact", fr: "Contact" },
  events: { en: "Events", fr: "Événements" },
  blog: { en: "Blog", fr: "Blog" },
  category: { en: "Categories", fr: "Catégories" },
  "privacy-policy": { en: "Privacy Policy", fr: "Confidentialité" },
  "terms-of-use": { en: "Terms of Use", fr: "Conditions d'utilisation" },
};

const humanise = (slug: string) =>
  decodeURIComponent(slug).replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** BreadcrumbList for every page below home, built from the URL. */
export function BreadcrumbJsonLd() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return null;

  // "/blog/category" has no page of its own, so it isn't a crumb.
  const crumbs = segments
    .map((seg, i) => ({ seg, path: "/" + segments.slice(0, i + 1).join("/") }))
    .filter(({ path }) => path !== "/blog/category");

  const items = [{ seg: "", path: "" }, ...crumbs].map(({ seg, path }, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: NAMES[seg]?.[locale] ?? humanise(seg),
    item: `${BASE_URL}/${locale}${path}`,
  }));

  return (
    <JsonLd
      data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items }}
    />
  );
}
