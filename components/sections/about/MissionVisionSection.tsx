"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { MissionVisionContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Segment = { kind: "plain" | "mark" | "fill"; text: string };

/** `[word]` → highlighter stroke, `{phrase}` → full gradient fill. */
function parse(body: string): Segment[] {
  return body
    .split(/(\[[^\]]+\]|\{[^}]+\})/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("[")
        ? { kind: "mark", text: part.slice(1, -1) }
        : part.startsWith("{")
          ? { kind: "fill", text: part.slice(1, -1) }
          : { kind: "plain", text: part },
    );
}

/** Words as spans (so they can fill in one by one), spaces kept as text. */
function Words({ text }: { text: string }) {
  return text.split(/(\s+)/).map((w, i) =>
    /^\s+$/.test(w) || w === "" ? (
      <Fragment key={i}>{w}</Fragment>
    ) : (
      <span key={i} data-word>
        {w}
      </span>
    ),
  );
}

const MARK = {
  mission:
    "bg-[linear-gradient(#f4c600,#f4c600)] bg-[length:100%_0.32em] bg-[position:0_88%]",
  vision:
    "bg-[linear-gradient(90deg,#fab1a0,#f7886e)] bg-[length:100%_0.32em] bg-[position:0_88%]",
};
const FILL = {
  mission: "bg-[linear-gradient(90deg,#ffeaa7,#ffde75_45%,#f4c600)]",
  vision: "bg-[linear-gradient(90deg,#ffe0d6,#fab1a0_45%,#f7886e)]",
};

function Statement({
  body,
  tone,
}: {
  body: string;
  tone: "mission" | "vision";
}) {
  return parse(body).map((seg, i) =>
    seg.kind === "plain" ? (
      <Words key={i} text={seg.text} />
    ) : (
      <span
        key={i}
        data-hl={seg.kind}
        className={`box-decoration-clone bg-no-repeat ${
          seg.kind === "mark"
            ? MARK[tone]
            : `${FILL[tone]} -mx-[0.1em] rounded-[0.18em] bg-[length:100%_100%] px-[0.1em]`
        }`}
      >
        <Words text={seg.text} />
      </span>
    ),
  );
}

/**
 * Mission & Vision as "the sentence that writes itself".
 *
 * Desktop: the section pins and, as you scroll, the Mission statement fills
 * in word by word from pale to navy; its key words get a yellow highlighter
 * stroke and "meaningful work" a yellow gradient fill as they land. Then the
 * Mission lifts away, Vision rises into its place and fills the same way
 * (peach accents), while a pill in the Mission | Vision toggle slides across.
 *
 * Below lg nothing pins: both statements stack and each fills as it scrolls
 * through the viewport. Under prefers-reduced-motion everything is shown in
 * its final state, stacked.
 */
export function MissionVisionSection({
  data,
  locale,
}: {
  data: MissionVisionContent;
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-statement]");
      const parts = blocks.map((block) => ({
        block,
        words: gsap.utils.toArray<HTMLElement>("[data-word]", block),
        marks: gsap.utils.toArray<HTMLElement>("[data-hl]", block),
      }));

      // Fill one statement into a timeline: words brighten in sequence, each
      // highlight sweeps in as its last word lands.
      const fill = (
        tl: gsap.core.Timeline,
        part: (typeof parts)[number],
        at: number,
        step: number,
      ) => {
        part.words.forEach((w, i) =>
          tl.to(
            w,
            { opacity: 1, duration: step * 3, ease: "none" },
            at + i * step,
          ),
        );
        part.marks.forEach((m) => {
          const last = gsap.utils.toArray<HTMLElement>("[data-word]", m).pop();
          const i = last ? part.words.indexOf(last) : 0;
          tl.to(
            m,
            {
              backgroundSize:
                m.dataset.hl === "mark" ? "100% 0.32em" : "100% 100%",
              duration: step * 5,
              ease: "power2.out",
            },
            at + i * step,
          );
        });
        return at + part.words.length * step + step * 3;
      };

      const prime = () => {
        parts.forEach((p) => {
          gsap.set(p.words, { opacity: 0.14 });
          p.marks.forEach((m) =>
            gsap.set(m, {
              backgroundSize: m.dataset.hl === "mark" ? "0% 0.32em" : "0% 100%",
            }),
          );
        });
      };

      mm.add("(min-width: 1024px)", () => {
        prime();
        const [mission, vision] = parts;
        const pill = section.querySelector<HTMLElement>("[data-pill]");
        const tabs = gsap.utils.toArray<HTMLElement>("[data-tab]", section);
        gsap.set(vision.block, { yPercent: 25, opacity: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.6}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        let t = fill(tl, mission, 0, 0.1);
        t += 0.6; // a beat to take it in
        tl.to(
          mission.block,
          { yPercent: -25, opacity: 0, duration: 0.8, ease: "power2.in" },
          t,
        );
        tl.to(
          vision.block,
          { yPercent: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          t + 0.5,
        );
        if (pill && tabs[1]) {
          tl.to(
            pill,
            {
              x: tabs[1].offsetLeft,
              width: tabs[1].offsetWidth,
              duration: 0.8,
              ease: "power2.inOut",
            },
            t + 0.3,
          );
          tl.to(tabs[0], { color: "#101b62", duration: 0.4 }, t + 0.3);
          tl.to(tabs[1], { color: "#ffffff", duration: 0.4 }, t + 0.7);
        }
        t = fill(tl, vision, t + 1.2, 0.1);
        tl.to({}, { duration: 0.8 }, t); // hold on the finished Vision
      });

      mm.add("(max-width: 1023px)", () => {
        prime();
        parts.forEach((p) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: p.block,
              start: "top 85%",
              end: "bottom 50%",
              scrub: 0.6,
            },
          });
          fill(tl, p, 0, 0.1);
        });
      });
    }, section);

    // Size the toggle pill to the Mission tab at rest.
    const placePill = () => {
      const pill = section.querySelector<HTMLElement>("[data-pill]");
      const tab = section.querySelector<HTMLElement>("[data-tab]");
      if (pill && tab)
        gsap.set(pill, { x: tab.offsetLeft, width: tab.offsetWidth });
    };
    placePill();
    document.fonts?.ready.then(() => {
      placePill();
      ScrollTrigger.refresh();
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [locale]);

  const statements = [
    {
      tone: "mission" as const,
      title: data.missionTitle,
      body: data.missionBody,
    },
    { tone: "vision" as const, title: data.visionTitle, body: data.visionBody },
  ];

  return (
    // GSAP wraps the pinned <section> in a pin-spacer. This plain wrapper is
    // what React removes on navigation, so it never tries to detach the
    // section from a parent that is no longer its parent (removeChild error).
    <div>
      <section
        ref={sectionRef}
        aria-labelledby="mission-vision-eyebrow"
        className="relative w-full overflow-hidden bg-white"
      >
        <Container className="py-section flex flex-col gap-10 lg:min-h-[100svh] lg:justify-center lg:gap-14 lg:pt-[calc(var(--header-height)+3rem)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2
              id="mission-vision-eyebrow"
              className="bg-impact-yellow w-fit rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-black"
            >
              {getLocalizedText(data.eyebrow, locale)}
            </h2>
            {/* Progress toggle (desktop): which statement you're reading. */}
            <div
              aria-hidden="true"
              className="border-impact-blue/15 relative hidden items-center rounded-full border p-1 motion-safe:lg:flex"
            >
              <span
                data-pill
                className="bg-impact-blue absolute top-1 left-0 h-[calc(100%-0.5rem)] w-0 rounded-full"
              />
              {statements.map((s, i) => (
                <span
                  key={s.tone}
                  data-tab
                  className={`relative z-10 rounded-full px-5 py-2 text-sm font-semibold ${
                    i === 0 ? "text-white" : "text-impact-blue"
                  }`}
                >
                  {getLocalizedText(s.title, locale)}
                </span>
              ))}
            </div>
          </div>

          {/* On desktop (with motion) both statements share one cell so Vision
            replaces Mission; otherwise they stack. */}
          <div className="grid gap-14 motion-safe:lg:gap-0">
            {statements.map((s) => (
              <div
                key={s.tone}
                data-statement
                className="flex flex-col gap-5 motion-safe:lg:col-start-1 motion-safe:lg:row-start-1"
              >
                <h3
                  className={`flex items-center gap-3 text-sm font-semibold tracking-[0.12em] uppercase ${
                    s.tone === "mission" ? "text-impact-blue" : "text-[#d4583c]"
                  } motion-safe:lg:sr-only`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${
                      s.tone === "mission" ? "bg-impact-yellow" : "bg-[#f7886e]"
                    }`}
                  />
                  {getLocalizedText(s.title, locale)}
                </h3>
                <p
                  className={`text-impact-blue leading-[1.12] font-medium tracking-[-0.025em] text-pretty ${
                    locale === "fr"
                      ? "max-w-[34ch] text-[clamp(1.75rem,3.5vw,3.6rem)]"
                      : "max-w-[30ch] text-[clamp(2rem,4.2vw,4.25rem)]"
                  }`}
                >
                  <Statement
                    body={getLocalizedText(s.body, locale)}
                    tone={s.tone}
                  />
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
