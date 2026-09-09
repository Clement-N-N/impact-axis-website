import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPageLayout, type LegalPageContent } from "@/components/legal/LegalPageLayout";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsOfUse" });

  const title = t("title") || (locale === "fr" ? "Conditions d'utilisation" : "Terms of Use");
  const description =
    locale === "fr"
      ? "Lisez les conditions d'utilisation d'Impact Axis."
      : "Read the terms of use and service agreement for Impact Axis.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/terms-of-use`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/terms-of-use`,
        fr: `${baseUrl}/fr/terms-of-use`,
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

export default async function TermsOfUsePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("termsOfUse");
  const content: LegalPageContent = {
    title: t("title"),
    lastUpdatedLabel: t("lastUpdatedLabel"),
    lastUpdated: t("lastUpdated"),
    intro: t.raw("intro"),
    sections: t.raw("sections"),
  };

  return <LegalPageLayout {...content} />;
}
