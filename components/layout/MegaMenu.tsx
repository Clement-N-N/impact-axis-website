"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowRightIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import type { SocialLinks } from "@/sanity/types";
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
    href: "/work-with-us#funders-development-partners",
  },
  {
    key: "funders",
    Icon: FundersIcon,
    accent: "text-icon-green",
    href: "/work-with-us#employers-corporate-partners",
  },
  {
    key: "ecosystem",
    Icon: EcosystemIcon,
    accent: "text-icon-peach",
    href: "/work-with-us#education-training-institutions",
  },
  {
    key: "talented",
    Icon: TalentedIcon,
    accent: "text-icon-purple",
    href: "/work-with-us#mentors-professionals",
  },
] as const;

const imageColSpanStyles = cva("", {
  variants: {
    locale: {
      en: "lg:col-span-4 xxl:col-span-5 2xl:col-span-6",
      fr: "lg:col-span-3 xxl:col-span-4 2xl:col-span-5",
    },
  },
  defaultVariants: { locale: "en" },
});

const itemsColSpanStyles = cva("", {
  variants: {
    locale: {
      en: "lg:col-span-8 xxl:col-span-7 2xl:col-span-6",
      fr: "lg:col-span-9 xxl:col-span-8 2xl:col-span-7",
    },
  },
  defaultVariants: { locale: "en" },
});

const imageWidthStyles = cva("h-full object-cover", {
  variants: {
    locale: {
      en: "lg:w-[calc(50%-calc(var(--spacing-gutter)/2))] xxl:w-[calc(39.7%-calc(var(--spacing-gutter)/2))] 2xl:w-[calc(33%-calc(var(--spacing-gutter)/2))] lg:h-[250px] xxl:h-[275px] 2xl:h-[350px]",
      fr: "lg:w-[calc(67.5%-calc(var(--spacing-gutter)/2))] xxl:w-[calc(50%-calc(var(--spacing-gutter)/2))] 2xl:w-[calc(40%-calc(var(--spacing-gutter)/2))]",
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
  { key: "instagram", Icon: InstagramLogoIcon, label: "Instagram", hoverColor: "hover:text-[#E1306C]" },
  { key: "facebook", Icon: FacebookLogoIcon, label: "Facebook", hoverColor: "hover:text-[#1877F2]" },
  { key: "x", Icon: XLogoIcon, label: "X", hoverColor: "hover:text-[#000000]" },
  { key: "linkedin", Icon: LinkedinLogoIcon, label: "LinkedIn", hoverColor: "hover:text-[#0A66C2]" },
  { key: "youtube", Icon: YoutubeLogoIcon, label: "YouTube", hoverColor: "hover:text-[#FF0000]" },
] as const satisfies readonly { key: keyof SocialLinks; Icon: unknown; label: string; hoverColor: string }[];

export function MegaMenu({
  id,
  isOpen,
  socialLinks,
}: {
  id: string;
  isOpen: boolean;
  socialLinks: SocialLinks;
}) {
  const activeSocials = SOCIALS.filter((social) => Boolean(socialLinks?.[social.key])).map((social) => ({
    ...social,
    url: socialLinks[social.key]!,
  }));
  const t = useTranslations("nav");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const [itemsReady, setItemsReady] = useState(false);
  const [footerReady, setFooterReady] = useState(false);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const socialRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageScaleRef = useRef<HTMLImageElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const locale = useLocale();

  useEffect(() => {
    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
      gsap.to(el, {
        opacity: isDimmed ? 0.4 : 1,
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

  useEffect(() => {
    const items = itemRefs.current.filter((el): el is HTMLElement => !!el);
    const targets = [
      imageRef.current,
      ...items,
      socialsRef.current,
      taglineRef.current,
    ].filter((el): el is HTMLElement => !!el);

    gsap.set(targets, { opacity: 0, y: 12 });
    gsap.set(imageScaleRef.current, { scale: 1.15 });

    tlRef.current = gsap
      .timeline({ paused: true })
      .to(imageRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      }, 0.1)
      .to(imageScaleRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
      }, 0.25)
      .to(items, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: {
          each: 0.07,
          onComplete: () => setItemsReady(true),
        },
      }, 0.18)
      .to([socialsRef.current, taglineRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: {
          each: 0.06,
          onComplete: () => setFooterReady(true),
        },
      }, "+=0.05");

    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    setItemsReady(false);
    setFooterReady(false);
  }

  useEffect(() => {
    if (isOpen) {
      tlRef.current?.timeScale(1).play(0);
    } else {
      tlRef.current?.timeScale(2.5).reverse();
    }
  }, [isOpen]);

  return (
    <motion.div
      id={id}
      aria-hidden={!isOpen}
      inert={!isOpen}
      initial={{ height: 0 }}
      animate={{ height: isOpen ? "auto" : 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="absolute inset-x-0 top-full z-2000 overflow-hidden border-t border-border bg-white"
    >
      <Container className="grid grid-cols-1 gap-gutter py-6 lg:grid-cols-12">
        <div ref={imageRef} className={clsx(imageColSpanStyles({ locale: locale === "fr" ? "fr" : "en" }), "overflow-hidden")}>
          <Image
            ref={imageScaleRef}
            src="/images/girls-1.jpg"
            alt={locale === "fr" ? "Image du menu" : "Menu image"}
            className={imageWidthStyles({ locale: locale === "fr" ? "fr" : "en" })}
            width={480}
            height={360}
            priority
          />
        </div>

        <ul
          className={clsx(
            itemsColSpanStyles({ locale: locale === "fr" ? "fr" : "en" }),
            "flex flex-col justify-center gap-6",
            !itemsReady && "pointer-events-none"
          )}
        >
          {ITEMS.map(({ key, Icon, accent, href }, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <li key={key}>
                <Link
                  href={href}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="flex w-fit items-center gap-4"
                  onMouseEnter={(e) => {
                    setHoveredIndex(index);
                    gsap.to(e.currentTarget.querySelector("[data-icon]"), {
                      scale: 1.08,
                      duration: 0.3,
                      ease: "power2.out",
                    });
                    gsap.to(e.currentTarget.querySelector("[data-arrow]"), {
                      opacity: 1,
                      x: 0,
                      duration: 0.3,
                      ease: "power2.out",
                    });
                  }}
                  onMouseLeave={(e) => {
                    setHoveredIndex(null);
                    gsap.to(e.currentTarget.querySelector("[data-icon]"), {
                      scale: 1,
                      duration: 0.3,
                      ease: "power2.out",
                    });
                    gsap.to(e.currentTarget.querySelector("[data-arrow]"), {
                      opacity: 0,
                      x: -8,
                      duration: 0.3,
                      ease: "power2.out",
                    });
                  }}
                >
                  <Icon
                    data-icon
                    className={clsx(
                      "h-[32px] w-[32px] shrink-0 transition-colors",
                      isHovered ? accent : "text-black"
                    )}
                  />
                  <span
                    className={clsx(
                      "text-xl transition-colors text-black",
                    )}
                  >
                    {t(`megaMenu.items.${key}`)}
                  </span>
                  <ArrowRightIcon
                    data-arrow
                    weight="bold"
                    className={clsx("h-4 w-4 -translate-x-2 opacity-0", accent)}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
      <div className="">
        <Container
          className={clsx(
            "border-t border-border grid grid-cols-1 items-center gap-gutter py-[12px] lg:grid-cols-12",
            !footerReady && "pointer-events-none"
          )}
        >
          <div ref={socialsRef} className={clsx(imageColSpanStyles({ locale: locale === "fr" ? "fr" : "en" }), "flex items-center gap-4 text-black")}>
            {activeSocials.map(({ key, Icon, label, hoverColor, url }, index) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
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
          <p ref={taglineRef} className={clsx(itemsColSpanStyles({ locale: locale === "fr" ? "fr" : "en" }), "text-xs text-black")}>
            <span className={footerTextStyles({ locale: locale === "fr" ? "fr" : "en" })}>{t("megaMenu.tagline")}</span>
          </p>
        </Container>
      </div>
    </motion.div>
  );
}
