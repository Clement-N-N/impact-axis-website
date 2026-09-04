import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "workWithUs" });

  const title = t("title") || (locale === "fr" ? "Travailler avec nous" : "Work With Us");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/work-with-us`;

  return {
    title,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/work-with-us`,
        fr: `${baseUrl}/fr/work-with-us`,
      },
    },
  };
}

export default async function WorkWithUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("workWithUs");

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-32">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
    </div>
  );
}
