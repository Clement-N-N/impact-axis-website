import { setRequestLocale } from "next-intl/server";
import { BlogHero } from "@/components/sections/blog-hero";
import { BlogBody } from "@/components/sections/blog-body";
import type { Locale } from "@/i18n/routing";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <BlogHero locale={locale as Locale} />
      <BlogBody locale={locale as Locale} />
    </>
  );
}
