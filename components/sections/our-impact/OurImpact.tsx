import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { ourImpactContent } from "./data";
import { ImpactCard } from "./ImpactCard";

export function OurImpact({ locale }: { locale: Locale }) {
  const data = ourImpactContent;

  return (
    <section className="w-full bg-white py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:sticky lg:top-24 lg:self-start">
          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-6">
            <div className="hidden h-full lg:col-span-1 lg:block">
              <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
            </div>

            <div className="lg:col-span-2 lg:col-start-2">
              <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-black">
                {getLocalizedText(data.eyebrow, locale)}
              </span>
            </div>

            <div className="mt-16 lg:col-span-5 lg:col-start-1">
              <h2 className="text-[clamp(1.125rem,2vw,1.7rem)] font-medium leading-[1.3] text-black">
                {getLocalizedText(data.paragraph, locale)}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-span-4 grid grid-cols-1 gap-gutter md:col-span-8 md:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {data.metrics.map((metric) => (
            <ImpactCard key={metric.number} metric={metric} locale={locale} />
          ))}
        </div>
      </Container>
    </section>
  );
}
