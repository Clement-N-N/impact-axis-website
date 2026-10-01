import type { PromoCardContent } from "@/components/ui/PromoCard";
import type { LocalizedText } from "@/components/sections/home-hero/types";
import { client } from "./client";
import { OPEN_CALL_QUERY } from "./queries";

export type OpenCall = {
  id: string;
  title: LocalizedText;
  applicationsCloseAt: string;
  applyHref: string;
  learnMoreHref?: string;
  image: string;
};

const BADGE: LocalizedText = {
  en: "📢 Applications open",
  fr: "📢 Candidatures ouvertes",
};

const APPLY: LocalizedText = { en: "Apply now", fr: "Postuler" };
const LEARN_MORE: LocalizedText = { en: "Learn more", fr: "En savoir plus" };

const DEFAULT_LEARN_MORE_HREF = "/what-we-do#goodwill-fellowship";

function isOpenCall(value: unknown): value is OpenCall {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Record<string, unknown>;
  const title = c.title as Record<string, unknown> | undefined;
  return (
    typeof c.id === "string" &&
    typeof title?.en === "string" &&
    typeof title?.fr === "string" &&
    typeof c.applicationsCloseAt === "string" &&
    typeof c.applyHref === "string" &&
    typeof c.image === "string"
  );
}

/** "Applications end on 25 June 2026" / "...le 25 juin 2026", from the date. */
function deadlineLine(closeAt: string): LocalizedText {
  const date = new Date(`${closeAt}T00:00:00Z`);
  const format = (locale: string) =>
    new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);

  return {
    en: `Applications end on ${format("en-GB")}`,
    fr: `Les candidatures se terminent le ${format("fr-FR")}`,
  };
}

/**
 * The open call currently accepting applications, or null.
 *
 * The query filters on `now()`, so a call whose deadline has passed is never
 * returned. There is deliberately no static fallback: falling back to hardcoded
 * copy is exactly how the previous card came to advertise a cohort that had
 * closed months earlier. No open call means no card.
 */
export async function getOpenCallPromo(): Promise<PromoCardContent | null> {
  try {
    const result = await client.fetch(
      OPEN_CALL_QUERY,
      {},
      { next: { revalidate: 300 } },
    );
    if (!isOpenCall(result)) return null;

    return {
      badgeLabel: BADGE,
      image: result.image,
      title: result.title,
      dateLine: deadlineLine(result.applicationsCloseAt),
      applyButton: { label: APPLY, href: result.applyHref },
      learnMoreButton: {
        label: LEARN_MORE,
        href: result.learnMoreHref || DEFAULT_LEARN_MORE_HREF,
      },
    };
  } catch (error) {
    console.error("Failed to fetch the open call from Sanity.", error);
    return null;
  }
}
