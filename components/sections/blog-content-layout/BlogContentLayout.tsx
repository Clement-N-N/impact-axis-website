import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

export function BlogContentLayout({
  main,
  sidebar,
}: {
  main: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <section className="pb-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
        </div>
        <div className="col-span-4 pr-[2rem] md:col-span-7 lg:col-span-8">
          <div className="max-w-[70ch]">
            {main}
          </div>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <div className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
            {sidebar}
          </div>
        </div>
      </Container>
    </section>
  );
}
