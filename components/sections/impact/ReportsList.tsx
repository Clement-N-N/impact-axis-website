"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  ArrowSquareOutIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { downloadUrl, formatFileSize, type Report } from "@/sanity/reports";
import type { Locale } from "@/i18n/routing";
import type { ReportsListContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Groups are driven by what has actually been published: a heading only appears
 * when a report of that category exists. The page therefore never advertises a
 * document nobody can open, and a new category starts appearing the moment the
 * first report of that kind is uploaded.
 */
export function ReportsList({
  data,
  reports,
  locale,
}: {
  data: ReportsListContent;
  reports: Report[];
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const groupsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const groups = groupsRef.current
        ? gsap.utils.toArray<HTMLElement>(groupsRef.current.children)
        : [];
      const fadeTargets = [
        eyebrowRef.current,
        introRef.current,
        ...groups,
      ].filter(Boolean);

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
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(eyebrowRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          })
            .to(
              self.lines,
              { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 },
              "-=0.3",
            )
            .to(
              introRef.current,
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
              "-=0.3",
            )
            .to(
              groups,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.12,
              },
              "-=0.25",
            );

          return tl;
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  const populated = data.groups
    .map((group) => ({
      copy: group,
      items: reports.filter((report) => report.category === group.category),
    }))
    .filter((group) => group.items.length > 0);

  if (populated.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <span
            ref={eyebrowRef}
            className="text-impact-gray text-[clamp(0.875rem,1.05vw,1rem)]"
          >
            {getLocalizedText(data.eyebrow, locale)}
          </span>
        </div>

        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0">
          <h2 className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.3] font-medium text-black">
            <span ref={headlineRef} className="block">
              {getLocalizedText(data.headline, locale)}
            </span>
          </h2>
          <p
            ref={introRef}
            className="text-impact-gray mt-6 max-w-2xl text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7]"
          >
            {getLocalizedText(data.intro, locale)}
          </p>
        </div>

        <div
          ref={groupsRef}
          className="col-span-4 mt-12 flex flex-col gap-14 md:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-16"
        >
          {populated.map(({ copy, items }) => (
            <div key={copy.category} className="flex flex-col gap-3">
              <h3 className="text-[clamp(1.125rem,1.4vw,1.25rem)] font-medium text-black">
                {getLocalizedText(copy.title, locale)}
              </h3>
              <p className="text-impact-gray max-w-2xl text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7]">
                {getLocalizedText(copy.description, locale)}
              </p>

              {/* Cards in the same language as the highlighted report above.
                  A thin full-width row put the title and its two links at
                  opposite ends of a very wide column, which read as a table
                  rather than as something published. */}
              {/* One report per row at every width. The card spreads into two
                  columns from lg — copy on the left, actions on the right —
                  rather than being set side by side with another report. */}
              <ul className="mt-5 flex flex-col gap-4">
                {items.map((report) => {
                  const size = formatFileSize(report.fileSize);
                  return (
                    <li
                      key={report.id}
                      className="flex flex-col gap-4 bg-[#F5F5F5] p-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:p-7"
                    >
                      <div className="flex flex-col gap-2 lg:max-w-2xl">
                        <h4 className="text-[clamp(1.0625rem,1.3vw,1.1875rem)] font-medium text-black">
                          {getLocalizedText(report.title, locale)}
                        </h4>

                        {report.periodLabel || size ? (
                          <span className="text-impact-blue text-[0.8125rem]">
                            {report.periodLabel
                              ? getLocalizedText(report.periodLabel, locale)
                              : null}
                            {report.periodLabel && size ? " · " : null}
                            {size}
                          </span>
                        ) : null}

                        {report.summary ? (
                          <p className="mt-1 text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.65] text-black">
                            {getLocalizedText(report.summary, locale)}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <a
                          href={report.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-impact-blue inline-flex items-center gap-2 px-4 py-2.5 text-[0.875rem] font-medium text-white"
                        >
                          {getLocalizedText({ en: "Read", fr: "Lire" }, locale)}
                          <ArrowSquareOutIcon weight="bold" className="h-4 w-4" />
                        </a>
                        <a
                          href={downloadUrl(report, locale)}
                          className="border-border inline-flex items-center gap-2 border bg-white px-4 py-2.5 text-[0.875rem] font-medium text-black"
                        >
                          {getLocalizedText(
                            { en: "Download", fr: "Télécharger" },
                            locale,
                          )}
                          <DownloadSimpleIcon weight="bold" className="h-4 w-4" />
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
