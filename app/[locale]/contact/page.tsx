import type { Metadata } from "next";
import { pageTitle, withBrand } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactFaq, ContactSection } from "@/components/sections/contact";
import { getHomeFaqContent } from "@/components/sections/home-faq";
import type { Locale } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { SOCIAL_LINKS_QUERY } from "@/sanity/queries";
import type { SocialLinks } from "@/sanity/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  const title = pageTitle("contact", locale);
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
      title: withBrand(title),
      description,
      url: canonical,
      siteName: "Impact Axis",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: withBrand(title),
      description,
    },
  };
}

async function getSocialLinks(): Promise<SocialLinks> {
  try {
    const result = await client.fetch(
      SOCIAL_LINKS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    if (result && typeof result === "object") return result as SocialLinks;
  } catch (error) {
    console.error("Failed to fetch social links from Sanity.", error);
  }
  return {};
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const tFooter = await getTranslations("footer");
  const [socialLinks, faq] = await Promise.all([
    getSocialLinks(),
    getHomeFaqContent(),
  ]);

  return (
    <div className="w-full bg-white">
      <ContactSection
        locale={loc}
        email={tFooter("email")}
        phone={tFooter("tel")}
        address={tFooter("address")}
        socialLinks={socialLinks}
      />
      {faq && <ContactFaq faqs={faq.faqs} locale={loc} />}
    </div>
  );
}
