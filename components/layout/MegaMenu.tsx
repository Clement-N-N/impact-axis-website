"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useLocale } from "next-intl";
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { hubContent } from "@/components/sections/work-with-us/hub-data";
import type { Locale } from "@/i18n/routing";
import type { SocialLinks } from "@/sanity/types";
import { Container } from "./Container";

/** Short audience names for the menu; the pages keep the full titles. */
const SHORT = {
  "funders-development-partners": { en: "Funders", fr: "Financeurs" },
  "employers-corporate-partners": { en: "Employers", fr: "Employeurs" },
  "education-training-institutions": { en: "Educators", fr: "Établissements" },
  "mentors-professionals": { en: "Mentors", fr: "Mentors" },
} as const;

const COPY = {
  label: { en: "Work with us", fr: "Travailler avec nous" },
  sideTitle: { en: "Not sure where you fit?", fr: "Vous ne savez pas où vous situer ?" },
  sideBody: {
    en: "See every way to partner with us, side by side.",
    fr: "Découvrez toutes les façons de collaborer avec nous.",
  },
  sideCta: { en: "Explore Work With Us", fr: "Découvrir Travailler avec nous" },
  stats: [
    { value: "450+", label: { en: "young people", fr: "jeunes" } },
    { value: "$1.5M+", label: { en: "unlocked", fr: "débloqués" } },
  ],
  reply: {
    en: "We reply within two working days.",
    fr: "Nous répondons sous deux jours ouvrés.",
  },
  talk: { en: "Start a conversation", fr: "Entamer la conversation" },
  current: { en: "You're here", fr: "Vous êtes ici" },
};

/**
 * Work With Us mega menu: the four audiences as photo cards (same photos
 * and promises as the hub), a navy "Not sure where you fit?" card into the
 * hub, and a strip with the reply promise. Cards are dealt in as the menu
 * opens; the hovered card lifts and its arrow turns. The current audience
 * page is marked. Arrow keys move between cards; Esc (handled by Navbar)
 * closes.
 */
export function MegaMenu({
  id,
  isOpen,
}: {
  id: string;
  isOpen: boolean;
  socialLinks?: SocialLinks;
}) {
  const locale = useLocale() as Locale;
  const t = (v: { en: string; fr: string }) => getLocalizedText(v, locale);
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = list.querySelectorAll("[data-mm]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(items, { opacity: 1, y: 0, rotation: 0 });
      return;
    }
    if (isOpen) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 40, rotation: (i: number) => (i - 2) * 2.5 },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.06,
          delay: 0.08,
          overwrite: true,
        },
      );
    } else {
      gsap.to(items, { opacity: 0, y: 16, duration: 0.15, overwrite: true });
    }
  }, [isOpen]);

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const links = Array.from(
      e.currentTarget.querySelectorAll<HTMLAnchorElement>("a[data-mm-link]"),
    );
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (i === -1) return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + links.length) % links.length;
    links[next].focus();
  };

  return (
    <motion.div
      id={id}
      aria-hidden={!isOpen}
      inert={!isOpen}
      initial={{ height: 0 }}
      animate={{ height: isOpen ? "auto" : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="border-border absolute inset-x-0 top-full z-2000 overflow-hidden border-t bg-white shadow-[0_40px_60px_-30px_rgb(7_12_46/0.45)]"
    >
      <Container className="py-6">
        <nav aria-label={t(COPY.label)}>
          <ul
            ref={listRef}
            onKeyDown={onKeyDown}
            className="grid grid-cols-5 gap-3 2xl:gap-4"
          >
            {hubContent.cards.map((card) => {
              const href = `/work-with-us/${card.audience}`;
              const here = pathname === href;
              return (
                <li key={card.audience} data-mm>
                  <Link
                    href={href}
                    data-mm-link
                    aria-current={here ? "page" : undefined}
                    className="group focus-visible:outline-impact-blue relative block h-[clamp(14rem,30svh,18rem)] overflow-hidden rounded-[22px] text-white transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-20px_rgb(16_27_98/0.6)] focus-visible:outline-3 focus-visible:outline-offset-2"
                  >
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      quality={75}
                      sizes="20vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_12_46/0.92)_0%,rgb(7_12_46/0.35)_50%,rgb(7_12_46/0.05)_80%)]"
                    />
                    {here ? (
                      <span className="bg-impact-yellow text-impact-blue absolute top-3.5 left-3.5 rounded-full px-3 py-1 text-xs font-semibold">
                        {t(COPY.current)}
                      </span>
                    ) : null}
                    <span
                      aria-hidden="true"
                      className="bg-impact-yellow text-impact-blue absolute top-3.5 right-3.5 inline-flex size-9 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-45"
                    >
                      <ArrowUpRightIcon weight="bold" className="size-4" />
                    </span>
                    <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4 2xl:p-5">
                      <span className="text-xs font-semibold tracking-[0.14em] text-[#ffde75] uppercase">
                        {t(SHORT[card.audience])}
                      </span>
                      <span className="text-lg leading-[1.15] font-semibold text-balance 2xl:text-xl">
                        {t(card.promise)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
            <li data-mm>
              <Link
                href="/work-with-us"
                data-mm-link
                aria-current={pathname === "/work-with-us" ? "page" : undefined}
                className="bg-impact-blue group focus-visible:outline-impact-blue relative isolate flex h-full flex-col overflow-hidden rounded-[22px] p-5 text-white focus-visible:outline-3 focus-visible:outline-offset-2"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-[#74b9ff]/30 blur-[50px] transition-transform duration-700 group-hover:scale-125"
                />
                <span className="text-xl leading-tight font-semibold text-balance">
                  {t(COPY.sideTitle)}
                </span>
                <span className="mt-2 text-sm text-white/75">{t(COPY.sideBody)}</span>
                <span className="mt-4 flex gap-5">
                  {COPY.stats.map((s) => (
                    <span key={s.value} className="flex flex-col">
                      <span className="text-impact-yellow text-2xl font-bold tracking-[-0.02em]">
                        {s.value}
                      </span>
                      <span className="text-xs text-white/65">{t(s.label)}</span>
                    </span>
                  ))}
                </span>
                <span className="bg-impact-yellow text-impact-blue mt-auto inline-flex w-fit items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-transform group-hover:scale-[1.04]">
                  {t(COPY.sideCta)}
                  <ArrowRightIcon weight="bold" className="size-4" />
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
      <div className="border-border border-t">
        <Container className="flex items-center justify-between gap-4 py-3 text-sm">
          <span className="text-impact-blue/70">{t(COPY.reply)}</span>
          <Link
            href="/contact"
            className="text-impact-blue inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
          >
            {t(COPY.talk)}
            <ArrowRightIcon weight="bold" className="size-4" />
          </Link>
        </Container>
      </div>
    </motion.div>
  );
}
