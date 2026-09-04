import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  const title = t("title") || (locale === "fr" ? "Contactez-nous" : "Contact Us");
  const description =
    t("intro") ||
    (locale === "fr"
      ? "Contactez l'équipe Impact Axis pour toute question ou partenariat."
      : "Get in touch with the Impact Axis team for inquiries, support, or partnerships.");

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/contact`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/contact`,
        fr: `${baseUrl}/fr/contact`,
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
