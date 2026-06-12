"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { CaretDown } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  EcosystemIcon,
  FundersIcon,
  PartnersIcon,
  TalentedIcon,
} from "@/components/icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

const MEGA_ITEMS = [
  {
    key: "partners",
    Icon: PartnersIcon,
    href: "/work-with-us#partners-institutions",
  },
  {
    key: "funders",
    Icon: FundersIcon,
    href: "/work-with-us#funders-foundations",
  },
  {
    key: "ecosystem",
    Icon: EcosystemIcon,
    href: "/work-with-us#ecosystem-builders",
  },
  {
    key: "talented",
    Icon: TalentedIcon,
    href: "/work-with-us#talented-collaborators",
  },
] as const;

export function MobileNav() {
  const t = useTranslations("nav");
  const [isOpen, setIsOpen] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    setIsWorkOpen(false);
  }

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center text-black"
      >
        <Menu className="h-6 w-6" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col bg-white"
          >
            <div className="flex h-20 items-center justify-between px-6 md:px-12">
              <Logo />
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center text-black"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col overflow-y-auto px-6 py-4 md:px-12">
              <ul className="flex flex-col gap-1 text-2xl font-medium text-black">
                <li>
                  <Link href="/" onClick={close} className="block py-3">
                    {t("links.home")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={close} className="block py-3">
                    {t("links.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/what-we-do"
                    onClick={close}
                    className="block py-3"
                  >
                    {t("links.whatWeDo")}
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsWorkOpen((v) => !v)}
                    aria-expanded={isWorkOpen}
                    className="flex w-full items-center justify-between py-3"
                  >
                    <span>{t("links.workWithUs")}</span>
                    <CaretDown
                      weight="fill"
                      className={clsx(
                        "h-5 w-5 transition-transform",
                        isWorkOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isWorkOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {MEGA_ITEMS.map(({ key, Icon, href }) => (
                          <li key={key}>
                            <Link
                              href={href}
                              onClick={close}
                              className="flex items-center gap-4 py-3 pl-1 text-base font-normal text-black"
                            >
                              <Icon className="h-6 w-6" />
                              {t(`megaMenu.items.${key}`)}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                <li>
                  <Link href="/blog" onClick={close} className="block py-3">
                    {t("links.blog")}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center justify-between border-t border-border px-6 py-6 md:px-12">
              <LanguageSwitcher />
              <Link
                href="/work-with-us"
                onClick={close}
                className="rounded-full bg-impact-blue px-6 py-3 text-sm font-medium text-white"
              >
                {t("cta")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
