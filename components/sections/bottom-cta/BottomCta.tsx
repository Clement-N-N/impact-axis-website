import type { Locale } from "@/i18n/routing";
import { bottomCtaContent } from "./data";
import { BottomCtaBlock } from "./BottomCtaBlock";

export function BottomCta({ locale }: { locale: Locale }) {
  return (
    <section className="flex aspect-auto w-full flex-col overflow-hidden md:aspect-[24/5] md:flex-row">
      {bottomCtaContent.blocks.map((block, index) => (
        <BottomCtaBlock key={index} block={block} locale={locale} />
      ))}
    </section>
  );
}
