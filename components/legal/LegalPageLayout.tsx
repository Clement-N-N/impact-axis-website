import { Container } from "@/components/layout/Container";

type LegalSection = {
  heading: string;
  body?: string[];
  list?: string[];
  note?: string;
};

export type LegalPageContent = {
  title: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  contentsLabel: string;
  intro: string[];
  sections: LegalSection[];
};

/**
 * Anchors are numbered rather than slugged from the heading text, so the same
 * link resolves on both locales — `#section-3` is section three whether the
 * heading reads "3. Why We Process Your Data" or "3. Pourquoi nous traitons
 * vos données". A slug taken from the English heading would simply fail on the
 * French page.
 */
const anchorId = (index: number) => `section-${index + 1}`;

/**
 * Shared shell for the Privacy Policy and Terms of Use.
 *
 * These were a single unbroken column of a dozen-odd numbered sections with no
 * way in except scrolling. The two changes that matter are a navy document
 * header, so the page reads as part of the site rather than a bare text dump,
 * and a contents list that makes thirteen sections navigable.
 *
 * The body deliberately stays on white: long-form reading is what this page is
 * for, and a navy ground would make it worse.
 *
 * There is no scroll animation here, on purpose. The section-animations skill
 * exempts long-form legal pages, partly because a dozen staggered reveals is
 * not restraint and partly because an initial `opacity: 0` hides content for
 * anyone who deep-links to a section anchor before the animation runs. Since
 * this layout now *adds* those anchors, that risk would have become real.
 */
export function LegalPageLayout({
  title,
  lastUpdatedLabel,
  lastUpdated,
  contentsLabel,
  intro,
  sections,
}: LegalPageContent) {
  const contents = (
    <ol className="flex flex-col gap-2.5">
      {sections.map((section, index) => (
        <li key={section.heading}>
          <a
            href={`#${anchorId(index)}`}
            className="text-impact-blue/75 hover:text-impact-blue focus-visible:outline-impact-blue block text-sm leading-snug text-pretty transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {section.heading}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Document header, in the same navy language as the hero — shorter,
          because this is a masthead and not a hero. */}
      <section className="bg-impact-blue w-full">
        <Container className="py-[clamp(3rem,7vw,5rem)]">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-white">
              {title}
            </h1>
            <p className="mt-4 text-sm font-medium text-white/70">
              {lastUpdatedLabel} {lastUpdated}
            </p>
          </div>
        </Container>
      </section>

      {/* Tight under the navy band — that already separates the header from
          the document, so a full section's padding on top just opens a gap.
          The bottom keeps its full spacing before the footer. */}
      <section className="pb-section-lg w-full bg-white pt-[clamp(2.5rem,3.5vw,4rem)]">
        <Container>
          <div className="gap-gutter mx-auto grid max-w-5xl grid-cols-1 lg:grid-cols-[16rem_1fr] lg:items-start">
            {/* Phones get a closed disclosure so the contents never push the
                document itself below the fold; from `lg` it becomes a sticky
                rail that stays with the reader. */}
            <details className="border-border group rounded-[16px] border p-4 lg:hidden">
              <summary className="text-impact-blue flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
                {contentsLabel}
                <span
                  aria-hidden="true"
                  className="text-impact-blue/60 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <nav aria-label={contentsLabel} className="mt-4">
                {contents}
              </nav>
            </details>

            <nav
              aria-label={contentsLabel}
              className="top-[calc(var(--header-height)+2rem)] hidden self-start lg:sticky lg:block"
            >
              <p className="text-impact-gray mb-4 text-xs font-semibold tracking-[0.12em] uppercase">
                {contentsLabel}
              </p>
              {contents}
            </nav>

            <div className="min-w-0">
              <div className="flex flex-col gap-4">
                {intro.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[1.0625rem] leading-[1.75] text-pretty text-black/75"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 flex flex-col gap-12">
                {sections.map((section, index) => (
                  <section
                    key={section.heading}
                    id={anchorId(index)}
                    // Clears the sticky header when jumped to from the contents.
                    className="scroll-mt-[calc(var(--header-height)+1.5rem)]"
                  >
                    <h2 className="text-impact-blue text-[clamp(1.25rem,1.9vw,1.625rem)] leading-tight font-semibold tracking-[-0.01em] text-balance">
                      {section.heading}
                    </h2>
                    <div className="mt-4 flex flex-col gap-4">
                      {section.body?.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-[1.0625rem] leading-[1.75] text-pretty text-black/75"
                        >
                          {paragraph}
                        </p>
                      ))}
                      {section.list && (
                        <ul className="marker:text-impact-yellow flex list-disc flex-col gap-2.5 pl-5 text-[1.0625rem] leading-[1.75] text-pretty text-black/75">
                          {section.list.map((item) => (
                            <li key={item} className="pl-1">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.note && (
                        <p className="text-[1.0625rem] leading-[1.75] text-pretty text-black/75">
                          {section.note}
                        </p>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
