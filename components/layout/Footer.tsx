"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";

const inputStyles = "bg-white/10 px-4 py-3 text-white placeholder:text-white/50";

const SOCIALS = [
  { Icon: FacebookLogoIcon, label: "Facebook" },
  { Icon: InstagramLogoIcon, label: "Instagram" },
  { Icon: XLogoIcon, label: "X" },
  { Icon: LinkedinLogoIcon, label: "LinkedIn" },
  { Icon: YoutubeLogoIcon, label: "YouTube" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  const learnMoreLinks = [
    { href: "/", label: tNav("links.home") },
    { href: "/about", label: tNav("links.about") },
    { href: "/what-we-do", label: tNav("links.whatWeDo") },
    { href: "/blog", label: tNav("links.blog") },
    { href: "/impact", label: tNav("links.impact") },
  ];

  const workWithUsLinks = [
    { href: "/work-with-us#partners-institutions", label: tNav("megaMenu.items.partners") },
    { href: "/work-with-us#funders-foundations", label: tNav("megaMenu.items.funders") },
    { href: "/work-with-us#ecosystem-builders", label: tNav("megaMenu.items.ecosystem") },
    { href: "/work-with-us#talented-collaborators", label: tNav("megaMenu.items.talented") },
  ];

  const legalLinks = [
    { href: "#", label: t("legal.termsOfUse") },
    { href: "#", label: t("legal.privacyPolicy") },
    { href: "#", label: t("legal.donorPrivacyPolicy") },
  ];

  return (
    <footer className="w-full bg-[#141416] pt-16">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 flex flex-col justify-between gap-10 md:col-span-8 lg:col-span-6 lg:h-full">
          <div className="flex flex-col gap-6 w-[500px]">
            <h2 className="text-2xl font-medium text-white">{t("subscribe.title")}</h2>
            <p className="text-white/70">{t("subscribe.subtitle")}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: wire up to a real newsletter subscription service.
              }}
              className="flex flex-col gap-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="firstName"
                  placeholder={t("subscribe.firstName")}
                  className={inputStyles}
                />
                <input
                  name="lastName"
                  placeholder={t("subscribe.lastName")}
                  className={inputStyles}
                />
              </div>
              <input
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
          <p className="text-sm text-white/50">
            {t("copyright", { startYear: 2022, endYear: currentYear })}
          </p>
        </div>

        <div className="col-span-4 flex flex-col justify-between gap-10 md:col-span-8 lg:col-span-6 lg:h-full">
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-2 gap-6">
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

            <div className="flex flex-col gap-3 text-white/70">
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

            <div className="flex gap-3">
              {SOCIALS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center bg-white/10 text-white/70 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex gap-4 text-sm text-white/70">
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
