"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      className="text-xs text-black block w-[70px] h-header border-l border-border flex items-center justify-center"
    >
      {locale.toUpperCase()}
    </Link>
  );
}
