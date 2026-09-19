import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ParallaxImage } from "@/components/sections/parallax-image";
import {
  PartnershipHero,
  PartnershipStatement,
  PartnershipContact,
  partnershipContent,
  isPartnershipAudience,
  PARTNERSHIP_AUDIENCES,
} from "@/components/sections/partnership";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { routing, type Locale } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { SOCIAL_LINKS_QUERY } from "@/sanity/queries";
import type { SocialLinks } from "@/sanity/types";

type Props = {
  params: Promise<{ locale: string; audience: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PARTNERSHIP_AUDIENCES.map((audience) => ({ locale, audience })),
  );
}

async function getSocialLinks(): Promise<SocialLinks> {
  try {
    const result = await client.fetch(SOCIAL_LINKS_QUERY, {}, { next: { revalidate: 60 } });
    if (result && typeof result === "object") return result as SocialLinks;
  } catch (error) {
    console.error("Failed to fetch social links from Sanity.", error);
  }
  return {};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, audience } = await params;
  if (!isPartnershipAudience(audience)) return {};

  const loc = locale as Locale;
  const content = partnershipContent.audiences[audience];
  const title = getLocalizedText(content.name, loc);
  const description = getLocalizedText(content.metaDescription, loc);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/work-with-us/${audience}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/work-with-us/${audience}`,
        fr: `${baseUrl}/fr/work-with-us/${audience}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Impact Axis",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PartnershipPage({ params }: Props) {
  const { locale, audience } = await params;
  setRequestLocale(locale);

  if (!isPartnershipAudience(audience)) {
    notFound();
  }

  const loc = locale as Locale;
  const content = partnershipContent.audiences[audience];
  const socialLinks = await getSocialLinks();

  return (
    <div className="w-full bg-white">
      <PartnershipHero
        headline={content.headline}
        paragraphs={content.paragraphs}
        locale={loc}
      />
      <ParallaxImage
        src={partnershipContent.image}
        heightClass="h-[30vh] lg:h-[45vh]"
        padded={false}
      />
      <PartnershipStatement
        statement={partnershipContent.statement}
        locale={loc}
      />
      <PartnershipContact
        formSubject={content.formSubject}
        locale={loc}
        socialLinks={socialLinks}
      />
    </div>
  );
}
