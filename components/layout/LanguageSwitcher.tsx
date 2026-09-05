"use client";

import clsx from "clsx";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      className={clsx(
        "text-xs text-black flex items-center justify-center transition-colors hover:bg-black/5",
        className || "block w-[70px] h-header border-l border-border"
      )}
    >
      {otherLocale.toUpperCase()}
    </Link>
  );
}
