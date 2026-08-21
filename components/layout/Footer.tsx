"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import type { SocialLinks } from "@/sanity/types";
import { Container } from "./Container";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const inputStyles = "bg-white/10 px-4 py-3 text-white placeholder:text-white/50";

const SOCIALS = [
  { key: "facebook", Icon: FacebookLogoIcon, label: "Facebook" },
  { key: "instagram", Icon: InstagramLogoIcon, label: "Instagram" },
  { key: "x", Icon: XLogoIcon, label: "X" },
  { key: "linkedin", Icon: LinkedinLogoIcon, label: "LinkedIn" },
  { key: "youtube", Icon: YoutubeLogoIcon, label: "YouTube" },
] as const satisfies readonly { key: keyof SocialLinks; Icon: unknown; label: string }[];

export function Footer({ socialLinks }: { socialLinks: SocialLinks }) {
  const t = useTranslations("footer");
  const activeSocials = SOCIALS.filter((social) => socialLinks[social.key]);
  const tNav = useTranslations("nav");
  const currentYear = new Date().getFullYear();
  const formIdPrefix = useId();

  const learnMoreLinks = [
    { href: "/", label: tNav("links.home") },
    { href: "/about", label: tNav("links.about") },
    { href: "/what-we-do", label: tNav("links.whatWeDo") },
    { href: "/blog", label: tNav("links.blog") },
    { href: "/impact", label: tNav("links.impact") },
  ];

  const workWithUsLinks = [
    { href: "/work-with-us#funders-development-partners", label: tNav("megaMenu.items.partners") },
    { href: "/work-with-us#employers-corporate-partners", label: tNav("megaMenu.items.funders") },
    { href: "/work-with-us#education-training-institutions", label: tNav("megaMenu.items.ecosystem") },
    { href: "/work-with-us#mentors-professionals", label: tNav("megaMenu.items.talented") },
  ];

  const legalLinks = [
    { href: "/terms-of-use", label: t("legal.termsOfUse") },
    { href: "/privacy-policy", label: t("legal.privacyPolicy") },
    // { href: "#", label: t("legal.donorPrivacyPolicy") },
  ];

  const footerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subscribeParagraphRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const copyrightRef = useRef<HTMLParagraphElement>(null);
  const linksGridRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const legalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const fadeTargets = [
        subscribeParagraphRef.current,
        formRef.current,
        copyrightRef.current,
        linksGridRef.current,
        addressRef.current,
        socialsRef.current,
        legalRef.current,
      ];

      if (!headlineRef.current) return;

      split = SplitText.create(headlineRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(fadeTargets, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(fadeTargets, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(self.lines, { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 }).to(
            fadeTargets,
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08 },
            "-=0.3",
          );

          return tl;
        },
      });
    }, footerRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <footer ref={footerRef} className="w-full bg-[#141416] pt-16">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 flex flex-col justify-between gap-10 md:col-span-8 lg:col-span-6 lg:h-full">
          <div className="flex w-full max-w-[500px] flex-col gap-6">
            <h2 ref={headlineRef} className="text-2xl font-medium text-white">
              {t("subscribe.title")}
            </h2>
            <p ref={subscribeParagraphRef} className="text-white/70">
              {t("subscribe.subtitle")}
            </p>
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: wire up to a real newsletter subscription service.
              }}
              className="flex flex-col gap-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formIdPrefix}-firstName`} className="sr-only">
                    {t("subscribe.firstName")}
                  </label>
                  <input
                    id={`${formIdPrefix}-firstName`}
                    name="firstName"
                    placeholder={t("subscribe.firstName")}
                    className={`${inputStyles} w-full`}
                  />
                </div>
                <div>
                  <label htmlFor={`${formIdPrefix}-lastName`} className="sr-only">
                    {t("subscribe.lastName")}
                  </label>
                  <input
                    id={`${formIdPrefix}-lastName`}
                    name="lastName"
                    placeholder={t("subscribe.lastName")}
                    className={`${inputStyles} w-full`}
                  />
                </div>
              </div>
              <label htmlFor={`${formIdPrefix}-email`} className="sr-only">
                {t("subscribe.emailPlaceholder")}
              </label>
              <input
                id={`${formIdPrefix}-email`}
                type="email"
                name="email"
                placeholder={t("subscribe.emailPlaceholder")}
                className={inputStyles}
              />
              <button
                type="submit"
                className="bg-impact-yellow py-3 text-center font-medium text-black"
              >
                {t("subscribe.button")}
              </button>
            </form>
          </div>
          <p ref={copyrightRef} className="text-sm text-white/50">
            {t("copyright", { startYear: 2022, endYear: currentYear })}
          </p>
        </div>

        <div className="col-span-4 flex flex-col justify-between gap-10 md:col-span-8 lg:col-span-6 lg:h-full">
          <div className="flex flex-col gap-10">
            <div ref={linksGridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                <h3 className="font-medium text-white">{t("columns.learnMore")}</h3>
                {learnMoreLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-medium text-white">{t("columns.workWithUs")}</h3>
                {workWithUsLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-white/15" />

            <div ref={addressRef} className="flex flex-col gap-3 text-white/70">
              <p>{t("address")}</p>
              <p>
                <span className="font-medium text-white">{t("emailLabel")}</span>{" "}
                <a href={`mailto:${t("email")}`} className="underline">
                  {t("email")}
                </a>
                {"  "}
                <span className="font-medium text-white">{t("telLabel")}</span> {t("tel")}
              </p>
            </div>

            <div ref={socialsRef} className="flex gap-3">
              {activeSocials.map(({ key, Icon, label }) => (
                <a
                  key={key}
                  href={socialLinks[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center bg-white/10 text-white/70 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div ref={legalRef} className="flex gap-4 text-sm text-white/70">
            {legalLinks.map((link, index) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={index > 0 ? "border-l border-white/20 pl-4" : ""}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative col-span-4 mt-16 aspect-[6/1] w-full md:col-span-8 lg:col-span-12">
          <Image
            src="/logos/impact_axis_white_transparent.png"
            alt=""
            width={2000}
            height={1000}
            className="object-contain object-left opacity-10 w-full"
          />
        </div>
      </Container>
    </footer>
  );
}
