import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { whyWeExistContent } from "./data";

export function WhyWeExist({ locale }: { locale: Locale }) {
  const data = whyWeExistContent;

  return (
    <section className="py-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 h-full md:col-span-8 lg:col-span-4">
          <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black">
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 flex flex-col gap-10 md:col-span-8 lg:col-span-6">
          <h2 className="text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.3] font-medium text-black">
            {getLocalizedText(data.headline, locale)}
          </h2>
          <div className="flex flex-col gap-6">
            <p className="text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)]">
              {getLocalizedText(data.paragraphs[0], locale)}
            </p>
            <p className="text-impact-gray text-[clamp(1rem,1.25vw,1.125rem)]">
              {getLocalizedText(data.paragraphs[1], locale)}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
