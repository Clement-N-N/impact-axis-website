"use client";

import { useState } from "react";
import Image from "next/image";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { aboutPageContent } from "@/components/sections/about/data";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { PartnerLogo } from "@/components/sections/about/types";
import type { Locale } from "@/i18n/routing";

/** The one list of partners, mirroring the `partnerLogo` documents. */
export const PARTNER_LOGOS: PartnerLogo[] = aboutPageContent.partnership.logos;

/** Ask Sanity's CDN for a logo-sized source rather than the original. */
const sized = (url: string) =>
  url.includes("?") ? url : `${url}?w=480&fit=max&auto=format`;

const LABELS = {
  pause: { en: "Pause partner logos", fr: "Mettre en pause les logos" },
  play: { en: "Play partner logos", fr: "Relancer les logos" },
};

function LogoCard({ logo, compact }: { logo: PartnerLogo; compact: boolean }) {
  return (
    <li
      className={`group/logo flex shrink-0 flex-col items-center justify-center gap-2.5 rounded-[20px] bg-white px-6 outline outline-1 -outline-offset-1 outline-black/[0.07] transition-[box-shadow,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_18px_36px_-20px_rgb(16_27_98/0.45)] ${
        compact ? "h-24 w-44 md:h-28 md:w-52" : "h-28 w-52 md:h-32 md:w-60"
      }`}
    >
      <div
        className={`relative w-full grayscale transition-[filter,opacity] duration-500 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 [@media(hover:hover)]:opacity-70 ${
          compact ? "h-10 md:h-12" : "h-12 md:h-14"
        }`}
      >
        <Image
          src={sized(logo.logoUrl)}
          alt=""
          fill
          sizes="240px"
          className="object-contain"
        />
      </div>
      <span className="text-impact-blue/60 text-center text-xs font-medium">
        {logo.name}
      </span>
    </li>
  );
}

/**
 * One row. The list is rendered twice back to back and the track slides by
 * half its width, so the loop is seamless; the second copy is hidden from
 * assistive tech so each partner is announced once.
 */
function Row({
  logos,
  reverse = false,
  duration,
  paused,
  compact,
}: {
  logos: PartnerLogo[];
  reverse?: boolean;
  duration: number;
  paused: boolean;
  compact: boolean;
}) {
  return (
    <div className="group/row relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] py-2">
      <div
        className="flex w-max gap-4 group-hover/row:[animation-play-state:paused] md:gap-5"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: paused ? "paused" : undefined,
        }}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex shrink-0 gap-4 md:gap-5"
          >
            {logos.map((logo) => (
              <LogoCard
                key={`${copy}-${logo.name}`}
                logo={logo}
                compact={compact}
              />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Partner logos gliding across the page: two rows in opposite directions,
 * or one compact row. Rows pause on hover and from a pause button (WCAG
 * 2.2.2); logos sit in greyscale and come to colour on hover. Under
 * prefers-reduced-motion it's a static, wrapped grid of every partner.
 */
export function PartnerLogoMarquee({
  locale,
  rows = 2,
  logos = PARTNER_LOGOS,
}: {
  locale: Locale;
  rows?: 1 | 2;
  logos?: PartnerLogo[];
}) {
  const [paused, setPaused] = useState(false);
  const compact = rows === 1;
  const rowA = rows === 2 ? logos.filter((_, i) => i % 2 === 0) : logos;
  const rowB = logos.filter((_, i) => i % 2 === 1);

  return (
    <div className="flex flex-col gap-2 md:gap-3">
      <div className="motion-reduce:hidden">
        <Row
          logos={rowA}
          duration={compact ? 48 : 38}
          paused={paused}
          compact={compact}
        />
        {rows === 2 && (
          <Row
            logos={rowB}
            duration={44}
            reverse
            paused={paused}
            compact={compact}
          />
        )}
      </div>
      <Container className="hidden motion-reduce:block">
        <ul className="flex flex-wrap justify-center gap-4">
          {logos.map((logo) => (
            <LogoCard key={logo.name} logo={logo} compact={compact} />
          ))}
        </ul>
      </Container>
      <Container className="flex justify-end motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={getLocalizedText(
            paused ? LABELS.play : LABELS.pause,
            locale,
          )}
          className="text-impact-blue border-impact-blue/15 hover:border-impact-blue/40 focus-visible:outline-impact-blue inline-flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {paused ? (
            <PlayIcon weight="fill" className="size-4" />
          ) : (
            <PauseIcon weight="fill" className="size-4" />
          )}
        </button>
      </Container>
    </div>
  );
}

/** A slim band: a small label above one compact row of logos. */
export function PartnerLogoStrip({
  locale,
  label,
  className = "",
}: {
  locale: Locale;
  label: { en: string; fr: string };
  className?: string;
}) {
  return (
    <section
      aria-label={getLocalizedText(label, locale)}
      className={`w-full overflow-hidden py-14 md:py-20 ${className}`}
    >
      <Container>
        <p className="text-impact-blue/60 mb-6 text-center text-sm font-semibold tracking-[0.12em] uppercase md:mb-8">
          {getLocalizedText(label, locale)}
        </p>
      </Container>
      <PartnerLogoMarquee locale={locale} rows={1} />
    </section>
  );
}
