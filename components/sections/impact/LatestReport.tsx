"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
import type { LatestReportContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * The highlighted report.
 *
 * "Read" opens the PDF in a new tab so the browser's own viewer handles it
 * rather than embedding a multi-megabyte document in an iframe, which is
 * punishing on a phone. "Download" uses Sanity's `dl` parameter so the file
 * saves under a readable name instead of a hashed asset id.
 */
export function LatestReport({
  data,
  report,
  locale,
}: {
  data: LatestReportContent;
  report: Report | null;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      const fadeTargets = [eyebrowRef.current, cardRef.current].filter(Boolean);
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
              cardRef.current,
              { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
              "-=0.3",
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

  const size = report ? formatFileSize(report.fileSize) : null;

  return (
    <section
      ref={sectionRef}
      id="latest-report"
      className="py-section w-full scroll-mt-24 bg-white"
    >
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

          <div ref={cardRef} className="mt-10">
            {report ? (
              <div className="gap-gutter grid grid-cols-1 bg-[#F5F5F5] p-6 lg:grid-cols-12 lg:p-8">
                {report.coverImage ? (
                  <div className="relative aspect-[3/4] w-full overflow-hidden lg:col-span-4">
                    <Image
                      src={report.coverImage}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <div
                  className={
                    report.coverImage
                      ? "flex flex-col gap-3 lg:col-span-8"
                      : "flex flex-col gap-3 lg:col-span-12"
                  }
                >
                  <h3 className="text-[clamp(1.25rem,1.8vw,1.625rem)] font-medium text-black">
                    {getLocalizedText(report.title, locale)}
                  </h3>

                  {report.periodLabel ? (
                    <span className="text-impact-blue text-[clamp(0.875rem,1vw,0.9375rem)]">
                      {getLocalizedText(report.periodLabel, locale)}
                    </span>
                  ) : null}

                  {report.summary ? (
                    <p className="max-w-2xl text-[clamp(0.9375rem,1.1vw,1rem)] leading-[1.7] text-black">
                      {getLocalizedText(report.summary, locale)}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-impact-blue inline-flex items-center gap-2 px-5 py-3 text-[clamp(0.875rem,1vw,0.9375rem)] font-medium text-white"
                    >
                      {getLocalizedText(data.viewLabel, locale)}
                      <ArrowSquareOutIcon weight="bold" className="h-4 w-4" />
                    </a>
                    <a
                      href={downloadUrl(report, locale)}
                      className="border-border inline-flex items-center gap-2 border bg-white px-5 py-3 text-[clamp(0.875rem,1vw,0.9375rem)] font-medium text-black"
                    >
                      {getLocalizedText(data.downloadLabel, locale)}
                      <DownloadSimpleIcon weight="bold" className="h-4 w-4" />
                      {size ? (
                        <span className="text-impact-gray font-normal">
                          {size}
                        </span>
                      ) : null}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="border-border text-impact-gray border border-dashed p-8 text-center text-[clamp(0.9375rem,1.1vw,1rem)]">
                {getLocalizedText(data.emptyState, locale)}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
