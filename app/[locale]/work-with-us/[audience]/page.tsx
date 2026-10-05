import type { Metadata } from "next";
import { AUDIENCE_TITLES, pageMetadata } from "@/lib/seo";
import { PartnerLogoStrip } from "@/components/sections/partners/PartnerLogoMarquee";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  AudienceAlso,
  AudienceFormIntro,
  AudienceGets,
  AudienceHero,
  AudienceOptions,
} from "@/components/sections/partnership/AudienceSections";
import { HubSteps } from "@/components/sections/work-with-us/HubSections";
import { FALLBACK_STATS } from "@/components/sections/work-with-us/hub-data";
import { getImpactStats, type ImpactStatEntry } from "@/sanity/home";

function pickStats(stats: ImpactStatEntry[]) {
  // The money figure already sits on the funders hero; keep the rest.
  return (stats.length ? stats : FALLBACK_STATS)
    .filter((s) => !s.value.includes("$"))
    .slice(0, 4);
}
import {
  PartnershipContact,
  partnershipContent,
  isPartnershipAudience,
  PARTNERSHIP_AUDIENCES,
} from "@/components/sections/partnership";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { routing, type Locale } from "@/i18n/routing";
import { client, sanityFetchOptions } from "@/sanity/client";
import { SOCIAL_LINKS_QUERY } from "@/sanity/queries";
import type { SocialLinks } from "@/sanity/types";

type Props = {
  params: Promise<{ locale: string; audience: string }>;
};

// Only the four audience pages exist; any other slug is a plain 404 that
// isn't rendered or cached.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PARTNERSHIP_AUDIENCES.map((audience) => ({ locale, audience })),
  );
}

async function getSocialLinks(): Promise<SocialLinks> {
  try {
    const result = await client.fetch(
      SOCIAL_LINKS_QUERY,
      {},
      sanityFetchOptions,
    );
    if (result && typeof result === "object") return result as SocialLinks;
  } catch (error) {
    console.error("Failed to fetch social links from Sanity.", error);
  }
  return {};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, audience } = await params;
  if (!isPartnershipAudience(audience)) return {};

  const loc = locale as Locale;
  const content = partnershipContent.audiences[audience];
  return pageMetadata({
    locale,
    path: `/work-with-us/${audience}`,
    title: getLocalizedText(AUDIENCE_TITLES[audience] ?? content.name, loc),
    description: getLocalizedText(content.metaDescription, loc),
  });
}

export default async function PartnershipPage({ params }: Props) {
  const { locale, audience } = await params;
  setRequestLocale(locale);

  if (!isPartnershipAudience(audience)) {
    notFound();
  }

  const loc = locale as Locale;
  const content = partnershipContent.audiences[audience];
  const socialLinks = await getSocialLinks();

  const stats = pickStats(await getImpactStats());

  return (
    <div className="w-full bg-white">
      <AudienceHero audience={audience} locale={loc} />
      <AudienceOptions audience={audience} locale={loc} />
      <AudienceGets audience={audience} locale={loc} stats={stats} />
      <HubSteps locale={loc} compact />
      <PartnerLogoStrip
        locale={loc}
        label={{
          en: "Trusted by partners like",
          fr: "Ils nous font confiance",
        }}
      />
      <AudienceFormIntro audience={audience} locale={loc} />
      <div className="bg-[#f4f6fc]">
        <PartnershipContact
          formSubject={content.formSubject}
          locale={loc}
          socialLinks={socialLinks}
        />
      </div>
      <AudienceAlso audience={audience} locale={loc} />
    </div>
  );
}
