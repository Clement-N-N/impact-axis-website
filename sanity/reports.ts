import type { LocalizedText } from "@/components/sections/home-hero/types";
import { client } from "./client";
import { REPORTS_QUERY } from "./queries";

export type ReportCategory = "annual" | "midYear" | "financial";

export type Report = {
  id: string;
  title: LocalizedText;
  category: ReportCategory;
  publishedAt: string;
  periodLabel?: LocalizedText;
  summary?: LocalizedText;
  featured?: boolean;
  fileUrl: string;
  fileSize?: number;
  coverImage?: string;
};

const CATEGORIES = new Set<string>(["annual", "midYear", "financial"]);

function isLocalizedText(value: unknown): value is LocalizedText {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.en === "string" && typeof candidate.fr === "string"
  );
}

function isReport(value: unknown): value is Report {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    isLocalizedText(candidate.title) &&
    typeof candidate.category === "string" &&
    CATEGORIES.has(candidate.category) &&
    typeof candidate.publishedAt === "string" &&
    typeof candidate.fileUrl === "string"
  );
}

/**
 * Reports are published from Sanity Studio, so the Impact page renders whatever
 * is there rather than a hardcoded list — adding next year's report is an
 * upload, not a release. An empty result is a legitimate state and the page is
 * expected to handle it: nothing has been uploaded yet.
 */
export async function getReports(): Promise<Report[]> {
  try {
    const result = await client.fetch(
      REPORTS_QUERY,
      {},
      { next: { revalidate: 300 } },
    );
    if (Array.isArray(result)) {
      return result.filter(isReport);
    }
  } catch (error) {
    console.error("Failed to fetch reports from Sanity.", error);
  }
  return [];
}

/**
 * Sanity serves assets with a `dl` parameter that forces a download and names
 * the saved file, so visitors get `2025-Annual-Report.pdf` rather than a hashed
 * asset id.
 */
export function downloadUrl(report: Report, locale: "en" | "fr"): string {
  const name = report.title[locale]
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "");
  return `${report.fileUrl}?dl=${name}.pdf`;
}

export function formatFileSize(bytes?: number): string | null {
  if (!bytes) return null;
  const mb = bytes / 1_048_576;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}
