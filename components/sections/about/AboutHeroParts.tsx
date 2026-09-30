import { MoveRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeroHighlight } from "./AboutHeroMotion";

/**
 * Renders a headline where `*phrase*` marks a highlighted phrase, so the
 * emphasis lives in the content (both locales) rather than in the markup.
 */
export function HighlightedText({ text }: { text: string }) {
  return text
    .split(/(\*[^*]+\*)/)
    .map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <HeroHighlight key={i}>{part.slice(1, -1)}</HeroHighlight>
      ) : (
        part
      ),
    );
}

/**
 * Pill CTA with a long arrow, as in the design. Presses down to 0.96 and
 * transitions only the properties that change.
 */
export function HeroCta({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group bg-impact-yellow hover:bg-impact-yellow/90 inline-flex items-center gap-3 rounded-full py-4 ps-7 pe-6 text-base font-semibold whitespace-nowrap text-black transition-[background-color,scale] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.96] motion-reduce:active:scale-100"
    >
      {label}
      <MoveRight
        aria-hidden="true"
        strokeWidth={2}
        className="size-6 transition-transform duration-150 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
      />
    </Link>
  );
}
