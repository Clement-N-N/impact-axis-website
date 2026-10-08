"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

/**
 * "On this page" menu built from the article's section headings (H2). It
 * follows you down the page and highlights the section you are reading.
 */
export function ArticleToc({ entries, label }: { entries: { id: string; text: string }[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;
    const io = new IntersectionObserver(
      (items) => {
        const visible = items.filter((i) => i.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [entries]);

  if (entries.length < 2) return null;

  return (
    <nav aria-label={label} className="sticky top-[calc(var(--header-height)+2rem)]">
      <p className="text-impact-blue text-xs font-bold tracking-[0.14em] uppercase">{label}</p>
      <ol className="mt-4 flex flex-col gap-1 border-l border-[#e3e5ec]">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              aria-current={active === e.id ? "location" : undefined}
              className={clsx(
                "-ml-px block border-l-[3px] py-1.5 pl-4 text-sm leading-snug transition-colors",
                active === e.id
                  ? "border-impact-yellow text-impact-blue font-semibold"
                  : "border-transparent text-[#6b7090] hover:text-impact-blue",
              )}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
