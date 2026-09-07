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
    <section className="flex aspect-auto w-full overflow-hidden md:aspect-[24/5]">
      <BottomCtaBlock block={block} locale={locale} />
    </section>
  );
}
