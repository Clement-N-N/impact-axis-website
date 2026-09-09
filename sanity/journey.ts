import { client } from "./client";
import { JOURNEY_PAGE_QUERY, JOURNEY_MILESTONES_QUERY } from "./queries";
import type { JourneyPageContent, JourneyHeroContent, JourneyCtaContent, Milestone } from "@/components/sections/journey/types";
import { journeyPageContent as defaultContent } from "@/components/sections/journey/data";

export async function getJourneyPageContent(): Promise<JourneyPageContent> {
  try {
    const [pageResult, milestonesResult] = await Promise.all([
      client.fetch(JOURNEY_PAGE_QUERY, {}, { next: { revalidate: 60 } }),
      client.fetch(JOURNEY_MILESTONES_QUERY, {}, { next: { revalidate: 60 } }),
    ]);

    let hero: JourneyHeroContent = defaultContent.hero;
    if (pageResult?.heroHeadline?.en) {
      hero = {
        badge: pageResult.heroBadge || defaultContent.hero.badge,
        headline: pageResult.heroHeadline || defaultContent.hero.headline,
        subtitle: pageResult.heroSubtitle || defaultContent.hero.subtitle,
        backLink: pageResult.heroBackLink || defaultContent.hero.backLink,
      };
    }

    let cta: JourneyCtaContent = defaultContent.cta;
    if (pageResult?.ctaHeadline?.en) {
      cta = {
        tag: pageResult.ctaTag || defaultContent.cta.tag,
        headline: pageResult.ctaHeadline || defaultContent.cta.headline,
        paragraph: pageResult.ctaParagraph || defaultContent.cta.paragraph,
        ctaPartner: pageResult.ctaPartner || defaultContent.cta.ctaPartner,
        ctaReports: pageResult.ctaReports || defaultContent.cta.ctaReports,
      };
    }

    let milestones: Milestone[] = defaultContent.milestones;
    if (Array.isArray(milestonesResult) && milestonesResult.length > 0) {
      milestones = milestonesResult.map((m: Milestone) => ({
        year: m.year,
        shortYear: m.shortYear || m.year?.slice(-2) || "",
        badge: m.badge,
        phase: m.phase,
        title: m.title,
        description: m.description,
        yearSubtitle: m.yearSubtitle,
        tags: m.tags || [],
      }));
    }

    return {
      hero,
      milestones,
      cta,
    };
  } catch (error) {
    console.error("Failed to fetch Journey content from Sanity:", error);
    return defaultContent;
  }
}
