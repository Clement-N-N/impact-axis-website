import type { Locale } from "@/i18n/routing";

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatEventDate(dateIso: string, locale: Locale): string {
  const date = new Date(dateIso);
  const month = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    month: "short",
  }).format(date);
  const day = date.getDate();
  const year = date.getFullYear();

  if (locale === "fr") {
    return `${day} ${month} ${year}`;
  }

  return `${month} ${day}${getOrdinalSuffix(day)} ${year}`;
}
