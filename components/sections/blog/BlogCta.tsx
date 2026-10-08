import Image from "next/image";
import clsx from "clsx";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { getLocalizedText as t } from "@/components/sections/home-hero/types";
import { resolveSanityImageUrl } from "@/sanity/image";
import type { BlogPageContent } from "@/sanity/blog";
import { blogDefaults } from "./data";
import { SmartLink } from "./SmartLink";

/**
 * The call to action set in the "Blog Page" document. `band` is the wide
 * strip at the bottom of the blog page; `card` closes every article and
 * shows the optional photo.
 */
export function BlogCta({
  cta,
  locale,
  variant,
}: {
  cta: BlogPageContent["cta"];
  locale: Locale;
  variant: "band" | "card";
}) {
  const d = blogDefaults.cta;
  const eyebrow = cta?.eyebrow ?? d.eyebrow;
  const title = cta?.title ?? d.title;
  const text = cta?.text ?? d.text;
  const label = cta?.buttonLabel ?? d.buttonLabel;
  const href = cta?.buttonHref || d.buttonHref;
  const src = variant === "card" ? resolveSanityImageUrl(cta?.image, 800, 640) : null;

  return (
    <aside
      data-rise
      className={clsx(
        "bg-impact-blue relative isolate grid overflow-hidden rounded-[26px] text-white",
        src && "md:grid-cols-[1fr_0.8fr]",
      )}
    >
      <span aria-hidden="true" className="absolute -right-24 -bottom-24 -z-10 size-80 rounded-full bg-[#74b9ff]/25 blur-[70px]" />
      <div
        className={clsx(
          "flex flex-col gap-4 p-7 sm:p-10",
          variant === "band" && "lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-12",
        )}
      >
        <div className="flex max-w-[42rem] flex-col gap-3">
          <span className="text-impact-yellow text-[13px] font-bold tracking-[0.14em] uppercase">{t(eyebrow, locale)}</span>
          <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            {t(title, locale)}
          </h2>
          <p className="text-pretty text-white/80">{t(text, locale)}</p>
        </div>
        <SmartLink
          href={href}
          className="bg-impact-yellow text-impact-blue inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-6 py-3.5 font-bold shadow-[0_14px_30px_-14px_rgb(244_198_0/0.9)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {t(label, locale)}
          <ArrowRightIcon weight="bold" className="size-4" />
        </SmartLink>
      </div>
      {src && (
        <div className="relative min-h-56">
          <Image src={src} alt={cta?.image?.alt ?? ""} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
        </div>
      )}
    </aside>
  );
}
