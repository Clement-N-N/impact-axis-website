import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function WhatWeDoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("whatWeDo");

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-32">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
    </div>
  );
}
