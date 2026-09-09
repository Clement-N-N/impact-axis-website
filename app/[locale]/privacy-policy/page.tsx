import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPageLayout, type LegalPageContent } from "@/components/legal/LegalPageLayout";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });

  const title = t("title") || (locale === "fr" ? "Politique de confidentialité" : "Privacy Policy");
  const description =
    locale === "fr"
      ? "Lisez la politique de confidentialité d'Impact Axis."
      : "Read the privacy policy and data protection commitments for Impact Axis.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/privacy-policy`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/privacy-policy`,
        fr: `${baseUrl}/fr/privacy-policy`,
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

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacyPolicy");
  const content: LegalPageContent = {
    title: t("title"),
    lastUpdatedLabel: t("lastUpdatedLabel"),
    lastUpdated: t("lastUpdated"),
    intro: t.raw("intro"),
    sections: t.raw("sections"),
  };

  return <LegalPageLayout {...content} />;
}
