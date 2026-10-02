import type { Locale } from "@/i18n/routing";
import { BASE_URL, PAGE_DESCRIPTIONS, SITE_NAME } from "@/lib/seo";
import type { SocialLinks } from "@/sanity/types";

/**
 * Structured data (schema.org JSON-LD) for search engines and AI answer
 * engines. `<` is escaped so CMS text can't close the script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const ORG_ID = `${BASE_URL}/#organization`;

/** Used when Sanity's social links can't be fetched. */
const FALLBACK_PROFILES = [
  "https://www.linkedin.com/company/impact-axis/",
  "https://www.instagram.com/impact.axis",
  "https://web.facebook.com/impact.axis",
  "https://www.youtube.com/@Impact-Axis",
];

/** Who we are, on every page: the NGO, its site, and its public profiles. */
export function SiteJsonLd({ locale, socialLinks }: { locale: Locale; socialLinks: SocialLinks }) {
  const profiles = Object.values(socialLinks).filter(
    (v): v is string => typeof v === "string" && v.startsWith("http"),
  );
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "NGO",
            "@id": ORG_ID,
            name: SITE_NAME,
            url: BASE_URL,
            logo: `${BASE_URL}/logos/impact_axis_blue_white.png`,
            description: PAGE_DESCRIPTIONS.home[locale],
            foundingDate: "2021",
            email: "info@impact-axis.org",
            telephone: "+237680816656",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Rond-point Express, Biyem-Assi",
              addressLocality: "Yaoundé",
              addressCountry: "CM",
            },
            areaServed: { "@type": "Country", name: "Cameroon" },
            knowsAbout: [
              "Youth employability",
              "Workforce development",
              "Career readiness",
              "Mentoring",
              "Internships",
            ],
            sameAs: profiles.length ? profiles : FALLBACK_PROFILES,
          },
          {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            url: BASE_URL,
            name: SITE_NAME,
            inLanguage: ["en", "fr"],
            publisher: { "@id": ORG_ID },
          },
        ],
      }}
    />
  );
}

export function FaqJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (!faqs.length) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }}
    />
  );
}

export function ArticleJsonLd({
  url,
  headline,
  description,
  datePublished,
  authorName,
  image,
  locale,
}: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  authorName?: string;
  image?: string;
  locale: Locale;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: url,
        headline,
        description,
        datePublished,
        inLanguage: locale,
        ...(image ? { image } : {}),
        author: authorName ? { "@type": "Person", name: authorName } : { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
      }}
    />
  );
}
