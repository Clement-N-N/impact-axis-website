import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { whoWeServeContent } from "./data";
import { WhoWeServeCard } from "./WhoWeServeCard";

const CARD_COL_STARTS = ["lg:col-start-4", "lg:col-start-7", "lg:col-start-10"];

export function WhoWeServe({ locale }: { locale: Locale }) {
  const data = whoWeServeContent;

  return (
    <section className="w-full bg-white py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-2 lg:col-start-2">
          <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-black">
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        {data.cards.map((card, index) => (
          <WhoWeServeCard
            key={card.number}
            card={card}
            locale={locale}
            className={CARD_COL_STARTS[index]}
          />
        ))}
      </Container>
    </section>
  );
}
