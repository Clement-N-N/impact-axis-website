import type { Locale } from "@/i18n/routing";
import { bottomCtaContent } from "./data";
import type { BottomCtaContent } from "./types";
import { BottomCtaBlock } from "./BottomCtaBlock";

export function BottomCta({
  locale,
  data: propData,
}: {
  locale: Locale;
  data?: BottomCtaContent;
}) {
  const block = propData?.block ?? bottomCtaContent.block;
  return (
    <section aria-labelledby="bottom-cta-title" className="w-full bg-white py-[clamp(2.5rem,5vw,4.5rem)]">
      <BottomCtaBlock block={block} locale={locale} />
    </section>
  );
}
