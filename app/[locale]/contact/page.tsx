import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const tFooter = await getTranslations("footer");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-32 text-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-impact-gray max-w-md">{t("intro")}</p>
      </div>

      <div className="flex flex-col gap-2 text-impact-gray">
        <p>{tFooter("address")}</p>
        <p>
          <span className="font-medium text-black">{tFooter("emailLabel")}</span>{" "}
          <a href={`mailto:${tFooter("email")}`} className="underline">
            {tFooter("email")}
          </a>
        </p>
        <p>
          <span className="font-medium text-black">{tFooter("telLabel")}</span> {tFooter("tel")}
        </p>
      </div>
    </div>
  );
}
