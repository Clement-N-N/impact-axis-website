"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRightIcon, DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { downloadUrl, type Report, type ReportCategory } from "@/sanity/reports";
import type { ReportLibraryContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ORDER: ReportCategory[] = ["annual", "midYear", "financial"];

/**
 * Every report from Sanity as one document library: year, title, summary,
 * type, and Read / Download on a single row (stacked on phones). Filter chips
 * only appear for report types that have actually been published, so the page
 * never offers an empty category. The latest (or pinned) report is marked.
 */
export function ReportLibrary({
  data,
  reports,
  latestId,
  locale,
}: {
  data: ReportLibraryContent;
  reports: Report[];
  latestId: string | null;
  locale: Locale;
}) {
  const t = (v: { en: string; fr: string }) => getLocalizedText(v, locale);
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<ReportCategory | "all">("all");

  const categories = ORDER.filter((c) => reports.some((r) => r.category === c));
  const shown = filter === "all" ? reports : reports.filter((r) => r.category === filter);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const year = (r: Report) =>
    r.periodLabel ? t(r.periodLabel) : r.publishedAt.slice(0, 4);

  return (
    <section
      id="reports"
      ref={sectionRef}
      aria-labelledby="reports-title"
      className="w-full scroll-mt-[calc(var(--header-height)+1rem)] bg-white pb-[clamp(3.5rem,7vw,6rem)]"
    >
      <Container>
        <div className="border-impact-blue/10 flex flex-col gap-6 border-t pt-[clamp(2.5rem,5vw,4rem)] lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-[44rem] flex-col gap-3">
            <span data-rise className="text-sm font-semibold tracking-[0.14em] text-[#8a8ea3] uppercase">
              {t(data.eyebrow)}
            </span>
            <h2
              id="reports-title"
              data-rise
              className="text-impact-blue text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
            >
              {t(data.headline)}
            </h2>
            <p data-rise className="text-black/70 text-pretty">
              {t(data.intro)}
            </p>
          </div>

          {categories.length > 1 && (
            <div data-rise role="group" aria-label={t(data.eyebrow)} className="flex flex-wrap gap-2">
              {(["all", ...categories] as const).map((c) => {
                const count = c === "all" ? reports.length : reports.filter((r) => r.category === c).length;
                const on = filter === c;
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(c)}
                    className={clsx(
                      "rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-impact-blue focus-visible:outline-2 focus-visible:outline-offset-2",
                      on
                        ? "bg-impact-blue border-impact-blue text-white"
                        : "text-impact-blue border-[#d9dcea] bg-white hover:border-impact-blue/40",
                    )}
                  >
                    {c === "all" ? t(data.all) : t(data.categories[c])} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {shown.length === 0 ? (
          <p className="mt-10 rounded-[20px] bg-[#f4f6fc] p-8 text-black/70">{t(data.empty)}</p>
        ) : (
          <ul className="border-impact-blue mt-8 border-t-2">
            {shown.map((r) => (
              <li
                key={r.id}
                data-rise
                className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-b border-[#e3e5ec] py-6 md:grid-cols-[6.5rem_1fr_auto] md:items-center md:gap-x-8"
              >
                <span className="text-impact-blue text-2xl font-bold tracking-[-0.02em] md:text-[1.75rem]">
                  {year(r)}
                </span>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-impact-blue text-lg font-semibold">{t(r.title)}</h3>
                    <span className="rounded-full bg-[#eef1fb] px-2.5 py-0.5 text-xs font-semibold text-impact-blue">
                      {t(data.categories[r.category])}
                    </span>
                    {r.id === latestId && (
                      <span className="bg-impact-yellow text-impact-blue rounded-full px-2.5 py-0.5 text-xs font-bold">
                        {t(data.latest)}
                      </span>
                    )}
                  </div>
                  {r.summary && (
                    <p className="max-w-[70ch] text-black/65 text-pretty">{t(r.summary)}</p>
                  )}
                </div>
                <div className="col-span-2 flex flex-wrap gap-2 md:col-span-1 md:justify-end">
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t(data.read)}: ${t(r.title)}`}
                    className="text-impact-blue hover:border-impact-blue inline-flex items-center gap-1.5 rounded-full border border-[#d9dcea] px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-impact-blue focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {t(data.read)}
                    <ArrowUpRightIcon weight="bold" className="size-3.5" />
                  </a>
                  <a
                    href={downloadUrl(r, locale)}
                    aria-label={`${t(data.download)}: ${t(r.title)}`}
                    className="bg-impact-yellow text-impact-blue inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.04] focus-visible:outline-impact-blue focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <DownloadSimpleIcon weight="bold" className="size-4" />
                    {t(data.download)}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
