import type { Locale } from "@/i18n/routing";
import { bottomCtaContent } from "./data";
import { BottomCtaBlock } from "./BottomCtaBlock";

export function BottomCta({ locale }: { locale: Locale }) {
  return (
    <section className="flex aspect-auto w-full overflow-hidden md:aspect-[24/5]">
      <BottomCtaBlock block={bottomCtaContent.block} locale={locale} />
    </section>
  );
}
