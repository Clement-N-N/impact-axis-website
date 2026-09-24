import type { LocalizedText } from "@/components/sections/home-hero/types";

/**
 * The four partnership audiences. These strings are the URL slugs
 * (`/work-with-us/<slug>`) and are also what `MegaMenu.tsx`, `Footer.tsx` and
 * `MobileNav.tsx` link to — keep the three in sync if one is ever renamed.
 */
export const PARTNERSHIP_AUDIENCES = [
  "funders-development-partners",
  "employers-corporate-partners",
  "education-training-institutions",
  "mentors-professionals",
] as const;

export type PartnershipAudience = (typeof PARTNERSHIP_AUDIENCES)[number];

export function isPartnershipAudience(
  value: unknown,
): value is PartnershipAudience {
  return (
    typeof value === "string" &&
    (PARTNERSHIP_AUDIENCES as readonly string[]).includes(value)
  );
}

export type PartnershipContent = {
  /** Short label used for the page <title> and breadcrumb-style metadata. */
  name: LocalizedText;
  headline: LocalizedText;
  paragraphs: LocalizedText[];
  /** Pre-fills the contact form's subject line, so an enquiry arrives tagged. */
  formSubject: LocalizedText;
  /** Used for the page description in metadata. */
  metaDescription: LocalizedText;
};

export type PartnershipPageContent = {
  audiences: Record<PartnershipAudience, PartnershipContent>;
  /**
   * The same on every audience page — it frames the problem all four
   * partnership types are responding to, rather than any one of them.
   */
  statement: LocalizedText;
  /**
   * One shared image across all four pages, so swapping in per-audience
   * photography later is a single change here rather than four.
   */
  image: string;
};
