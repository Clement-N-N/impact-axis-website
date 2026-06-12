"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useTranslations, useLocale } from "next-intl";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import {
  EcosystemIcon,
  FundersIcon,
  PartnersIcon,
  TalentedIcon,
} from "@/components/icons";
import { Container } from "./Container";
import Image from 'next/image'

const ITEMS = [
  {
    key: "partners",
    Icon: PartnersIcon,
    accent: "text-icon-blue",
    href: "/work-with-us#partners-institutions",
  },
  {
    key: "funders",
    Icon: FundersIcon,
    accent: "text-icon-green",
    href: "/work-with-us#funders-foundations",
  },
  {
    key: "ecosystem",
    Icon: EcosystemIcon,
    accent: "text-icon-peach",
    href: "/work-with-us#ecosystem-builders",
  },
  {
    key: "talented",
    Icon: TalentedIcon,
    accent: "text-icon-purple",
    href: "/work-with-us#talented-collaborators",
  },
] as const;

const imageColSpanStyles = cva("", {
  variants: {
    locale: {
      en: "col-span-5 2xl:col-span-6",
      fr: "col-span-4 2xl:col-span-5",
    },
  },
  defaultVariants: { locale: "en" },
});

const itemsColSpanStyles = cva("", {
  variants: {
    locale: {
      en: "col-span-7 2xl:col-span-6",
      fr: "col-span-8 2xl:col-span-7",
    },
  },
  defaultVariants: { locale: "en" },
});

const imageWidthStyles = cva("h-full object-cover", {
  variants: {
    locale: {
      en: "lg:w-[calc(40%-calc(var(--spacing-gutter)/2))]",
      fr: "lg:w-[calc(50%-calc(var(--spacing-gutter)/2))]",
    },
  },
  defaultVariants: { locale: "en" },
});

const footerTextStyles = cva("block", {
  variants: {
    locale: {
      en: "lg:w-[calc(calc(100%/7*3)-calc(var(--spacing-gutter)/2))] 2xl:w-[calc(calc(100%/6*4)-calc(var(--spacing-gutter)/2))]",
      fr: "lg:w-[calc(calc(100%/8*3)-calc(var(--spacing-gutter)/2))] 2xl:w-[calc(calc(100%/7*4)-calc(var(--spacing-gutter)/2))]",
    },
  },
  defaultVariants: { locale: "en" },
});

const SOCIALS = [
  { Icon: InstagramLogoIcon, label: "Instagram", hoverColor: "hover:text-[#E1306C]" },
  { Icon: FacebookLogoIcon, label: "Facebook", hoverColor: "hover:text-[#1877F2]" },
  { Icon: XLogoIcon, label: "X", hoverColor: "hover:text-[#000000]" },
  { Icon: LinkedinLogoIcon, label: "LinkedIn", hoverColor: "hover:text-[#0A66C2]" },
  { Icon: YoutubeLogoIcon, label: "YouTube", hoverColor: "hover:text-[#FF0000]" },
] as const;

export function MegaMenu({ id, isOpen }: { id: string; isOpen: boolean }) {
  const t = useTranslations("nav");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const socialRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const locale = useLocale();

  useEffect(() => {
    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
      gsap.to(el, {
        opacity: isDimmed ? 0.6 : 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }, [hoveredIndex]);

  useEffect(() => {
    socialRefs.current.forEach((el, index) => {
      if (!el) return;
      const isDimmed = hoveredSocial !== null && hoveredSocial !== index;
      gsap.to(el, {
        opacity: isDimmed ? 0.45 : 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }, [hoveredSocial]);

  return (
    <motion.div
      id={id}
      aria-hidden={!isOpen}
      inert={!isOpen}
      initial={{ height: 0 }}
      animate={{ height: isOpen ? "auto" : 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="absolute inset-x-0 top-full z-50 overflow-hidden border-t border-border bg-white"
    >
      <Container className="grid grid-cols-1 gap-gutter py-6 lg:grid-cols-12">
        <div className={clsx(imageColSpanStyles({ locale: locale === "fr" ? "fr" : "en" }), "h-[275px]")}>
          <Image
            src="/images/girls-1.jpg"
            alt={locale === "fr" ? "Image du menu" : "Menu image"}
            className={imageWidthStyles({ locale: locale === "fr" ? "fr" : "en" })}
            width={480}
            height={360}
            priority
          />
        </div>

        <ul className={clsx(itemsColSpanStyles({ locale: locale === "fr" ? "fr" : "en" }), "flex flex-col justify-center gap-6")}>
          {ITEMS.map(({ key, Icon, accent, href }, index) => {
            const isHovered = hoveredIndex === index;
            const isDimmed = hoveredIndex !== null && !isHovered;
            return (
              <li key={key}>
                <Link
                  href={href}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="flex items-center gap-4"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Icon
                    className={clsx(
                      "h-[32px] w-[32px] shrink-0 transition-colors",
                      isHovered
                        ? accent
                        : isDimmed
                          ? "text-impact-gray"
                          : "text-black"
                    )}
                  />
                  <span
                    className={clsx(
                      "text-lg transition-colors",
                      isHovered
                        ? "font-medium text-black"
                        : isDimmed
                          ? "text-impact-gray"
                          : "text-black"
                    )}
                  >
                    {t(`megaMenu.items.${key}`)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
      <div className="">
        <Container className="border-t border-border grid grid-cols-1 items-center gap-gutter py-[12px] lg:grid-cols-12">
          <div className={clsx(imageColSpanStyles({ locale: locale === "fr" ? "fr" : "en" }), "flex items-center gap-4 text-black")}>
            {SOCIALS.map(({ Icon, label, hoverColor }, index) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                ref={(el) => {
                  socialRefs.current[index] = el;
                }}
                onMouseEnter={() => setHoveredSocial(index)}
                onMouseLeave={() => setHoveredSocial(null)}
                className={clsx("transition-colors", hoverColor)}
              >
                <Icon className="h-5 w-5" weight="fill" />
              </a>
            ))}
          </div>
          <p className={clsx(itemsColSpanStyles({ locale: locale === "fr" ? "fr" : "en" }), "text-xs text-black")}>
            <span className={footerTextStyles({ locale: locale === "fr" ? "fr" : "en" })}>{t("megaMenu.tagline")}</span>
          </p>
        </Container>
      </div>
    </motion.div>
  );
}
