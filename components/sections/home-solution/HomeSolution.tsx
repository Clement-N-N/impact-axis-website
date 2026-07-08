import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { homeSolutionContent } from "./data";

export function HomeSolution({ locale }: { locale: Locale }) {
  const data = homeSolutionContent;

  return (
    <section className="w-full bg-white py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
        <div className="hidden h-full lg:col-span-1 lg:row-start-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-2 lg:col-start-2 lg:row-start-1">
          <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black">
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 flex flex-col gap-10 md:col-span-8 lg:col-span-9 lg:col-start-4 lg:row-start-1 mb-20">
          <h2 className="text-[clamp(1.75rem,3vw,2.7rem)] font-medium leading-[1.3] text-black lg:text-[48px]">
            {getLocalizedText(data.headline, locale)}
          </h2>
          <Button
            href={data.button.href}
            variant="primary"
            icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
          >
            {getLocalizedText(data.button.label, locale)}
          </Button>
        </div>

        <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-4 lg:col-start-4 lg:row-start-2">
          <p className="text-[clamp(1rem,1.25vw,1.125rem)] text-impact-gray">
            {getLocalizedText(data.paragraphs[0], locale)}
          </p>
          <p className="text-[clamp(1rem,1.25vw,1.125rem)] text-impact-gray">
            {getLocalizedText(data.paragraphs[1], locale)}
          </p>
          <p className="text-[clamp(1rem,1.25vw,1.125rem)] text-impact-gray">
            {getLocalizedText(data.paragraphs[2], locale)}
          </p>
        </div>

        <div className="relative col-span-4 aspect-[4/5] md:col-span-8 lg:col-span-4 lg:col-start-9 lg:row-start-2">
          <Image src={data.image} alt="" fill className="object-cover" />
        </div>
      </Container>
    </section>
  );
}
