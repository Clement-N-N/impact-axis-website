import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  const title = t("title") || (locale === "fr" ? "À propos de nous" : "About Us");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/about`;

  return {
    title,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/about`,
        fr: `${baseUrl}/fr/about`,
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-32">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
    </div>
  );
}
