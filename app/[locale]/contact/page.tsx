import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactFaq, ContactSection } from "@/components/sections/contact";
import { getHomeFaqContent } from "@/components/sections/home-faq";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { SOCIAL_LINKS_QUERY } from "@/sanity/queries";
import type { SocialLinks } from "@/sanity/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata("contact", "/contact", locale);
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
      {faq && (
        <>
          <ContactFaq faqs={faq.faqs} locale={loc} />
          <FaqJsonLd
            faqs={faq.faqs.map((f) => ({
              question: getLocalizedText(f.question, loc),
              answer: getLocalizedText(f.answer, loc),
            }))}
          />
        </>
      )}
    </div>
  );
}
