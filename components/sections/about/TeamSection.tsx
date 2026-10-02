"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LinkedinLogoIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { TeamContent, TeamPerson } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

function GroupLabel({ children }: { children: string }) {
  return (
    <h3 className="text-impact-blue/55 flex items-center gap-4 text-sm font-semibold tracking-[0.14em] uppercase after:h-px after:flex-1 after:bg-black/10">
      {children}
    </h3>
  );
}

function LinkedIn({
  person,
  label,
  className,
}: {
  person: TeamPerson;
  label: string;
  className: string;
}) {
  if (!person.linkedin) return null;
  return (
    <a
      href={person.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label.replace("{name}", person.name)}
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      <LinkedinLogoIcon weight="fill" className="size-5" />
    </a>
  );
}

/**
 * The team at the end of the About page.
 *
 * Core team: tall portrait cards with name, role and LinkedIn; the card
 * lifts and the photo settles on hover. Fellows in residence: two compact
 * cards. Advisory board: a wrapping grid of square portraits; "Read bio"
 * opens a dialog with the full biography and previous/next. No sideways
 * scrolling anywhere: every group wraps on small screens.
 *
 * Cards rise in as the section arrives; under prefers-reduced-motion they
 * render in place.
 */
export function TeamSection({
  data,
  locale,
}: {
  data: TeamContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const L = (k: keyof TeamContent["labels"]) =>
    getLocalizedText(data.labels[k], locale);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        split = SplitText.create(headlineRef.current, {
          type: "lines",
          mask: "lines",
        });
        gsap.set(split.lines, { yPercent: 110 });
        gsap.to(split.lines, {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });
      }
      gsap.utils
        .toArray<HTMLElement>("[data-team-group]", section)
        .forEach((group) => {
          gsap.from(group.querySelectorAll("[data-team-card]"), {
            y: 48,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 82%", once: true },
          });
        });
    }, section);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [locale]);

  // Drive the native modal from state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (open === null && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const board = data.board;
  const person = open !== null ? board[open] : null;
  const step = (d: number) =>
    setOpen((i) => (i === null ? i : (i + d + board.length) % board.length));

  return (
    <section
      ref={sectionRef}
      aria-labelledby="team-title"
      className="py-section w-full bg-white"
    >
      <Container className="flex flex-col gap-14 md:gap-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black">
              {getLocalizedText(data.eyebrow, locale)}
            </span>
            <h2
              id="team-title"
              ref={headlineRef}
              className="text-impact-blue text-5xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {getLocalizedText(data.headline, locale)}
            </h2>
          </div>
          <p className="max-w-[52ch] text-lg text-pretty text-black/70 lg:col-span-5 lg:pb-2">
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>

        {/* Core team. */}
        <div data-team-group className="flex flex-col gap-6">
          <GroupLabel>{getLocalizedText(data.groups.core, locale)}</GroupLabel>
          <ul className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {data.core.map((p) => (
              <li key={p.name} data-team-card>
                <article className="group relative aspect-[3/4] overflow-hidden rounded-[22px] bg-slate-100 shadow-[0_1px_2px_rgb(16_27_98/0.08)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_50px_-25px_rgb(16_27_98/0.55)] md:rounded-[28px]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 24vw, 48vw"
                    className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_12_46/0.88)_0%,rgb(7_12_46/0.3)_32%,transparent_55%)]"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white md:p-5">
                    <div className="min-w-0">
                      <h4 className="text-base leading-tight font-semibold text-balance md:text-xl">
                        {p.name}
                      </h4>
                      <p className="mt-1 text-xs font-semibold text-[#ffde75] md:text-sm">
                        {getLocalizedText(p.role, locale)}
                      </p>
                    </div>
                    <LinkedIn
                      person={p}
                      label={L("linkedin")}
                      className="bg-white/15 text-white backdrop-blur-sm hover:bg-[#0a66c2] focus-visible:outline-white max-md:size-9"
                    />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        {/* Fellows in residence. */}
        <div data-team-group className="flex flex-col gap-6">
          <GroupLabel>
            {getLocalizedText(data.groups.fellows, locale)}
          </GroupLabel>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {data.fellows.map((p) => (
              <li key={p.name} data-team-card>
                <article className="flex items-center gap-4 rounded-[22px] bg-[#f4f6fc] p-3 pr-4 outline outline-1 -outline-offset-1 outline-black/[0.05]">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-[16px] bg-slate-200">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      quality={90}
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-impact-blue text-lg leading-tight font-semibold">
                      {p.name}
                    </h4>
                    <p className="text-impact-blue/60 mt-1 text-sm">
                      {getLocalizedText(p.role, locale)}
                    </p>
                  </div>
                  <LinkedIn
                    person={p}
                    label={L("linkedin")}
                    className="text-impact-blue focus-visible:outline-impact-blue bg-white hover:bg-[#0a66c2] hover:text-white"
                  />
                </article>
              </li>
            ))}
          </ul>
        </div>

        {/* Advisory board. */}
        <div data-team-group className="flex flex-col gap-6">
          <GroupLabel>{getLocalizedText(data.groups.board, locale)}</GroupLabel>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-7">
            {board.map((p, i) => (
              <li key={p.name} data-team-card>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group focus-visible:outline-impact-blue flex h-full w-full flex-col gap-3 rounded-[22px] bg-[#f4f6fc] p-3 text-left transition-[translate,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_40px_-24px_rgb(16_27_98/0.5)] focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span className="relative block aspect-square w-full overflow-hidden rounded-[16px] bg-slate-200">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      quality={90}
                      sizes="(min-width: 1280px) 190px, (min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                  </span>
                  <span className="flex flex-1 flex-col gap-1 px-1 pb-1">
                    <span className="text-impact-blue text-[0.95rem] leading-snug font-semibold">
                      {p.name}
                    </span>
                    <span className="text-[0.8rem] leading-snug text-pretty text-black/60">
                      {getLocalizedText(p.role, locale)}
                    </span>
                    <span className="text-impact-blue mt-auto inline-flex items-center gap-1 pt-2 text-[0.8rem] font-semibold">
                      {L("readBio")}
                      <ArrowRightIcon
                        weight="bold"
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* A slim closing line now Partnership lives on Work With Us. */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-impact-blue text-2xl font-semibold tracking-[-0.02em] text-balance">
            {getLocalizedText(data.closing.text, locale)}
          </p>
          <Link
            href={data.closing.cta.href}
            className="bg-impact-yellow focus-visible:outline-impact-blue inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {getLocalizedText(data.closing.cta.label, locale)}
            <ArrowRightIcon weight="bold" className="size-4" />
          </Link>
        </div>
      </Container>

      {/* Advisory board bio. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="team-bio-name"
        onClose={() => {
          document.documentElement.style.overflow = "";
          setOpen(null);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto w-[min(48rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-[28px] bg-white p-0 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.5)] backdrop:bg-[#070c2e]/60 backdrop:backdrop-blur-sm"
      >
        {person && (
          <div className="grid max-h-[calc(100dvh-2rem)] grid-cols-1 overflow-y-auto md:grid-cols-[15rem_1fr]">
            <div className="relative aspect-[4/3] bg-[linear-gradient(160deg,#cfe6ff,#74b9ff)] md:aspect-auto">
              <Image
                key={person.image}
                src={person.image}
                alt={person.name}
                fill
                quality={90}
                sizes="(min-width: 768px) 240px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative flex flex-col gap-3 p-6 md:p-9">
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label={L("close")}
                className="text-impact-blue focus-visible:outline-impact-blue absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-[#f1f3f9] transition-colors hover:bg-[#e3e7f3] focus-visible:outline-2"
              >
                <XIcon weight="bold" className="size-4" />
              </button>
              <span className="text-xs font-semibold tracking-[0.14em] text-[#d4583c] uppercase">
                {getLocalizedText(data.groups.board, locale)}
              </span>
              <h3
                id="team-bio-name"
                className="text-impact-blue pr-12 text-3xl leading-tight font-semibold tracking-[-0.02em]"
              >
                {person.name}
              </h3>
              <p className="text-impact-blue/60 font-semibold">
                {getLocalizedText(person.role, locale)}
              </p>
              {person.bio && (
                <p className="mt-2 text-base leading-relaxed text-pretty text-black/75">
                  {getLocalizedText(person.bio, locale)}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="text-impact-blue border-impact-blue/15 hover:border-impact-blue/40 focus-visible:outline-impact-blue inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline-2"
                >
                  <ArrowLeftIcon weight="bold" className="size-4" />
                  <span className="sr-only">{L("previous")}: </span>
                  {board[(open! - 1 + board.length) % board.length].name}
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="text-impact-blue border-impact-blue/15 hover:border-impact-blue/40 focus-visible:outline-impact-blue inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline-2"
                >
                  <span className="sr-only">{L("next")}: </span>
                  {board[(open! + 1) % board.length].name}
                  <ArrowRightIcon weight="bold" className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
