import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impact" });

  const title = t("title") || (locale === "fr" ? "Notre Impact" : "Our Impact");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/impact`;

  return {
    title,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/impact`,
        fr: `${baseUrl}/fr/impact`,
      },
    },
  };
}

export default async function ImpactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("impact");

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-32">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
    </div>
  );
}
