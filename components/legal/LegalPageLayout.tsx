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
  intro: string[];
  sections: LegalSection[];
};

export function LegalPageLayout({
  title,
  lastUpdatedLabel,
  lastUpdated,
  intro,
  sections,
}: LegalPageContent) {
  return (
    <section className="w-full bg-white py-section-lg">
      <Container className="mx-auto flex max-w-3xl flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-medium text-black">{title}</h1>
          <p className="text-sm text-impact-gray">
            {lastUpdatedLabel} {lastUpdated}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {intro.map((paragraph) => (
            <p key={paragraph} className="text-base text-impact-gray">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.heading} className="flex flex-col gap-4">
              <h2 className="text-2xl font-medium text-black">{section.heading}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="text-base text-impact-gray">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="flex flex-col gap-2 list-disc pl-6 text-base text-impact-gray">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.note && <p className="text-base text-impact-gray">{section.note}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
