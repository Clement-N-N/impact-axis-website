import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPageLayout, type LegalPageContent } from "@/components/legal/LegalPageLayout";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });

  return { title: t("title") };
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
