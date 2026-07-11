"use client";

import { useId, useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { HomeFaqContent } from "./types";
import { FaqAccordionItem } from "./FaqAccordionItem";

export function FaqSection({ data, locale }: { data: HomeFaqContent; locale: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="w-full bg-white py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>

        <div className="col-span-4 h-full md:col-span-8 lg:col-span-4">
          <span className="text-[clamp(0.875rem,1.3125vw,1.1875rem)] text-black">
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 border-b border-border md:col-span-8 lg:col-span-6 lg:col-start-7">
          {data.faqs.map((item, index) => (
            <FaqAccordionItem
              key={index}
              item={item}
              locale={locale}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              panelId={`${baseId}-panel-${index}`}
            />
          ))}
        </div>

        <div className="col-span-4 mt-16 flex flex-col items-start gap-6 md:col-span-8 lg:col-span-6 lg:col-start-7">
          <h3 className="text-[clamp(1.5rem,2.375vw,2rem)] font-medium text-black">
            {getLocalizedText(data.stillHaveQuestionsHeading, locale)}
          </h3>
          <Button
            href={data.contactButton.href}
            variant="primary"
            icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
          >
            {getLocalizedText(data.contactButton.label, locale)}
          </Button>
        </div>
      </Container>
    </section>
  );
}
