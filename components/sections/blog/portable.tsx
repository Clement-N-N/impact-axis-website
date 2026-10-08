import Image from "next/image";
import clsx from "clsx";
import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react";
import { ArrowRightIcon, LightbulbIcon } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { getLocalizedText as t } from "@/components/sections/home-hero/types";
import { urlFor } from "@/sanity/image";
import type { SanityImageValue } from "@/sanity/types";
import { blogLabels } from "./data";
import { SmartLink } from "./SmartLink";

/** Plain text of a block, used for heading ids and the "On this page" menu. */
export function blockText(block: PortableTextBlock): string {
  return (block.children ?? [])
    .map((c) => ("text" in c && typeof c.text === "string" ? c.text : ""))
    .join("");
}

/** A stable, readable id for an H2, e.g. "1. Communication" -> "1-communication". */
export function headingId(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "section"
  );
}

export function tocEntries(body: PortableTextBlock[]): { id: string; text: string }[] {
  return body
    .filter((b) => b._type === "block" && b.style === "h2")
    .map((b) => {
      const text = blockText(b);
      return { id: headingId(text), text };
    })
    .filter((e) => e.text.trim());
}

function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

type BlogImageValue = SanityImageValue & {
  caption?: string;
  size?: "normal" | "wide" | "full";
  dims?: { width: number; height: number } | null;
};

const text = "text-[17px] leading-[1.75] text-[#2d3250] sm:text-lg";

/**
 * How each piece of a post body renders. Text keeps a comfortable reading
 * width; "wide" images and pairs reach past it on large screens.
 */
export function blogPortableComponents(locale: Locale): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => <p className={clsx(text, "mb-6 text-pretty")}>{children}</p>,
      h2: ({ children, value }) => (
        <h2
          id={headingId(blockText(value))}
          className="text-impact-blue mt-14 mb-5 scroll-mt-[calc(var(--header-height)+1.5rem)] text-[clamp(1.625rem,2.4vw,2rem)] leading-[1.15] font-semibold tracking-[-0.025em] text-balance"
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-impact-blue mt-10 mb-4 text-[clamp(1.3rem,1.8vw,1.5rem)] leading-snug font-semibold tracking-[-0.015em]">
          {children}
        </h3>
      ),
      h4: ({ children }) => <h4 className="text-impact-blue mt-8 mb-3 text-lg font-semibold">{children}</h4>,
      blockquote: ({ children }) => (
        <blockquote className="text-impact-blue my-8 border-l-4 border-[#d9dcea] pl-5 text-lg leading-relaxed italic">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={clsx(text, "marker:text-impact-yellow mb-6 ml-6 list-disc space-y-2")}>{children}</ul>
      ),
      number: ({ children }) => (
        <ol className={clsx(text, "marker:text-impact-blue mb-6 ml-6 list-decimal space-y-2 marker:font-bold")}>{children}</ol>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="text-impact-blue font-semibold">{children}</strong>,
      link: ({ value, children }) => (
        <SmartLink
          href={value?.href ?? "#"}
          className="text-impact-blue decoration-impact-yellow font-medium underline decoration-2 underline-offset-[3px] hover:decoration-[3px]"
        >
          {children}
        </SmartLink>
      ),
    },
    types: {
      blogImage: ({ value }: { value: BlogImageValue }) => {
        if (!value?.asset) return null;
        const w = value.dims?.width ?? 1600;
        const h = value.dims?.height ?? 1067;
        const size = value.size ?? "normal";
        return (
          <figure
            className={clsx(
              "my-10",
              size === "wide" && "lg:-mr-[clamp(4rem,9vw,9rem)]",
              size === "full" && "lg:-mr-[clamp(4rem,9vw,9rem)] lg:-ml-[calc(220px+3.5rem)]",
            )}
          >
            <Image
              src={urlFor(value).width(1800).fit("max").url()}
              alt={value.alt ?? ""}
              width={w}
              height={h}
              sizes={size === "normal" ? "(min-width: 1024px) 720px, 100vw" : "(min-width: 1024px) 1100px, 100vw"}
              className="h-auto w-full rounded-[20px] bg-[#eef1fb]"
            />
            {value.caption && <figcaption className="mt-3 text-sm text-[#6b7090]">{value.caption}</figcaption>}
          </figure>
        );
      },
      imagePair: ({ value }: { value: { left?: SanityImageValue; right?: SanityImageValue; caption?: string } }) => (
        <figure className="my-10 lg:-mr-[clamp(4rem,9vw,9rem)]">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[value.left, value.right].map((img, i) =>
              img?.asset ? (
                <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#eef1fb]">
                  <Image
                    src={urlFor(img).width(900).height(1125).url()}
                    alt={img.alt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 540px, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : null,
            )}
          </div>
          {value.caption && <figcaption className="mt-3 text-sm text-[#6b7090]">{value.caption}</figcaption>}
        </figure>
      ),
      pullQuote: ({ value }: { value: { quote?: string; attribution?: string } }) => (
        <figure className="border-impact-yellow my-12 border-l-[5px] py-1 pl-6 sm:pl-8">
          <blockquote className="text-impact-blue text-[clamp(1.5rem,2.4vw,1.875rem)] leading-[1.25] font-semibold tracking-[-0.02em] text-balance">
            “{value.quote}”
          </blockquote>
          {value.attribution && <figcaption className="mt-4 text-sm font-medium text-[#6b7090]">{value.attribution}</figcaption>}
        </figure>
      ),
      keyTakeaways: ({ value }: { value: { title?: string; items?: string[] } }) => (
        <aside className="my-10 rounded-[20px] bg-[#eef1fb] p-7 sm:p-8">
          <p className="text-impact-blue text-[13px] font-bold tracking-[0.14em] uppercase">
            {value.title || t(blogLabels.keyTakeaways, locale)}
          </p>
          <ul className="mt-4 space-y-3">
            {(value.items ?? []).map((item, i) => (
              <li key={i} className="flex gap-3 text-[17px] leading-relaxed text-[#2d3250]">
                <span aria-hidden="true" className="bg-impact-yellow mt-[0.6em] size-2 shrink-0 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      ),
      statHighlight: ({ value }: { value: { value?: string; label?: string; source?: string } }) => (
        <aside className="bg-impact-blue relative isolate my-10 flex flex-col gap-3 overflow-hidden rounded-[20px] p-7 text-white sm:flex-row sm:items-center sm:gap-7 sm:p-8">
          <span aria-hidden="true" className="absolute -right-16 -bottom-20 -z-10 size-56 rounded-full bg-[#74b9ff]/25 blur-[60px]" />
          <span className="text-impact-yellow shrink-0 text-[clamp(3rem,6vw,4.25rem)] leading-none font-bold tracking-[-0.04em]">
            {value.value}
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="text-[17px] leading-snug text-pretty text-white/90">{value.label}</span>
            {value.source && <span className="text-sm text-white/60">{value.source}</span>}
          </span>
        </aside>
      ),
      tipBox: ({ value }: { value: { title?: string; text?: string } }) => (
        <aside className="my-10 flex gap-4 rounded-[20px] bg-[linear-gradient(180deg,#ffeaa7,#ffde75)] p-6 sm:p-7">
          <LightbulbIcon weight="duotone" aria-hidden="true" className="text-impact-blue size-7 shrink-0" />
          <div>
            <p className="text-impact-blue text-[13px] font-bold tracking-[0.14em] uppercase">
              {value.title || t(blogLabels.tip, locale)}
            </p>
            <p className="text-impact-blue mt-2 text-[17px] leading-relaxed">{value.text}</p>
          </div>
        </aside>
      ),
      ctaButton: ({ value }: { value: { label?: string; href?: string } }) =>
        value.href && value.label ? (
          <p className="my-8">
            <SmartLink
              href={value.href}
              className="bg-impact-yellow text-impact-blue focus-visible:outline-impact-blue inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-bold shadow-[0_14px_30px_-14px_rgb(244_198_0/0.9)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {value.label}
              <ArrowRightIcon weight="bold" className="size-4" />
            </SmartLink>
          </p>
        ) : null,
      youtube: ({ value }: { value: { url?: string; caption?: string } }) => {
        const id = youtubeId(value.url);
        if (!id) return null;
        return (
          <figure className="my-10">
            <div className="relative aspect-video overflow-hidden rounded-[20px] bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={value.caption || "YouTube video"}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            </div>
            {value.caption && <figcaption className="mt-3 text-sm text-[#6b7090]">{value.caption}</figcaption>}
          </figure>
        );
      },
    },
  };
}
