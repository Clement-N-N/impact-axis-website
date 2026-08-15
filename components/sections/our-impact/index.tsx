import type { Locale } from "@/i18n/routing";
import type { LocalizedText } from "@/components/sections/home-hero/types";
import { client } from "@/sanity/client";
import { HOME_IMPACT_QUERY } from "@/sanity/queries";
import { ourImpactChrome, IMPACT_CARD_DESIGNS } from "./data";
import type { ImpactMetric, ImpactStat, OurImpactContent } from "./types";
import { ImpactSection } from "./ImpactSection";

function isLocalizedText(value: unknown): value is LocalizedText {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.en === "string" && typeof record.fr === "string";
}

function isImpactStat(value: unknown): value is ImpactStat {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.number === "string" && isLocalizedText(item.label);
}

function isSanityImpactData(value: unknown): value is { metrics: ImpactStat[] } {
  if (typeof value !== "object" || value === null) return false;
  const content = value as Record<string, unknown>;
  if (!Array.isArray(content.metrics) || content.metrics.length === 0) return false;
  return content.metrics.every(isImpactStat);
}

async function getOurImpactContent(): Promise<OurImpactContent | null> {
  try {
    const result = await client.fetch(HOME_IMPACT_QUERY, {}, { next: { revalidate: 60 } });
    if (isSanityImpactData(result)) {
      // Card visuals (image, background) stay hardcoded by position and repeat
      // in sequence if there are more stats than designs.
      const metrics: ImpactMetric[] = result.metrics.map((stat, index) => ({
        ...stat,
        ...IMPACT_CARD_DESIGNS[index % IMPACT_CARD_DESIGNS.length],
      }));
      return { ...ourImpactChrome, metrics };
    }
  } catch (error) {
    console.error("Failed to fetch home impact content from Sanity.", error);
  }
  return null;
}

export async function OurImpact({ locale }: { locale: Locale }) {
  const data = await getOurImpactContent();
  if (!data) return null;
  return <ImpactSection data={data} locale={locale} />;
}
