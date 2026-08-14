import clsx from "clsx";
import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { getLocalizedText, type LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { cva } from "class-variance-authority";

const cardColStyles = cva(
  "self-center bg-[#F5F5F5] p-3 flex flex-col gap-4",
  {
    variants: {
      locale: {
        en: "col-span-3 col-start-10",
        fr: "col-span-3 col-start-10",
      },
    },
    defaultVariants: { locale: "en" },
  },
);

const cardStyles = cva(
  "self-center bg-[image:var(--gradient-yellow)] p-3 flex flex-col gap-4",
  {
    variants: {
      locale: {
        en: "col-span-3 col-start-10",
        fr: "col-span-3 col-start-10",
      },
    },
    defaultVariants: { locale: "en" },
  },
);

export type PromoCardContent = {
  badgeLabel: LocalizedText;
  image: string;
  title: LocalizedText;
  dateLine: LocalizedText;
  applyButton: { label: LocalizedText; href: string };
  learnMoreButton: { label: LocalizedText; href: string };
};

export function PromoCard({
  content,
  locale,
  className,
}: {
  content: PromoCardContent;
  locale: Locale;
  className?: string;
}) {
  return (
    <div className={cardColStyles({ locale })}>
      <div className={cardStyles({ locale })}>
        <span className="text-sm font-medium text-black">
   
          {getLocalizedText(content.badgeLabel, locale)}
        </span>
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={content.image}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-lg !font-medium text-black !leading-[120%]">
          {getLocalizedText(content.title, locale)}
        </h2>
        <p className="text-black text-sm">
          {getLocalizedText(content.dateLine, locale)}
        </p>
        <Button
          href={content.applyButton.href}
          variant="dark"
          icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
        >
          {getLocalizedText(content.applyButton.label, locale)}
        </Button>
        <Button
          href={content.learnMoreButton.href}
          variant="outline"
          className="self-center"
        >
          {getLocalizedText(content.learnMoreButton.label, locale)}
        </Button>
      </div>
    </div>
  );
}
