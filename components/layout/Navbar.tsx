"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import { CaretDownIcon } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "./Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MegaMenuBackdrop } from "./MegaMenuBackdrop";
import { MobileNav } from "./MobileNav";

const MEGA_MENU_ID = "work-with-us-menu";

const navLinkStyles = cva(
  "relative flex h-[23px] items-center justify-center text-sm",
  {
    variants: {
      active: {
        true: "text-impact-blue after:absolute after:-bottom-0.5 after:right-0 after:h-0.5 after:w-3 after:bg-impact-blue",
        false: "text-black",
      },
    },
    defaultVariants: { active: false },
  },
);

const logoColStyles = cva("", {
  variants: {
    locale: {
      en: "col-span-5 2xl:col-span-6",
      fr: "col-span-4 2xl:col-span-5",
    },
  },
  defaultVariants: { locale: "en" },
});

const navColStyles = cva(
  "flex h-full items-center justify-between gap-[40px]",
  {
    variants: {
      locale: {
        en: "col-span-7 2xl:col-span-6",
        fr: "col-span-8 2xl:col-span-7",
      },
    },
    defaultVariants: { locale: "en" },
  },
);

function NavLinkText({
  label,
  isHovered,
}: {
  label: string;
  isHovered: boolean;
}) {
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!topRef.current || !bottomRef.current) return;
    const method = isFirstRender.current ? gsap.set : gsap.to;
    method(topRef.current, {
      yPercent: isHovered ? -100 : 0,
      duration: 0.35,
      ease: "power2.out",
    });
    method(bottomRef.current, {
      yPercent: isHovered ? 0 : 100,
      duration: 0.35,
      ease: "power2.out",
    });
    isFirstRender.current = false;
  }, [isHovered]);

  return (
    <span className="relative inline-block overflow-y-hidden">
      <span ref={topRef} className="block">
        {label}
      </span>
      <span
        ref={bottomRef}
        aria-hidden="true"
        className="text-impact-blue absolute inset-0"
      >
        {label}
      </span>
    </span>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const NAV_LINKS_BEFORE = [
    { href: "/", label: t("links.home") },
    { href: "/about", label: t("links.about") },
    { href: "/what-we-do", label: t("links.whatWeDo") },
  ] as const;
  const NAV_LINKS_AFTER = [
    { href: "/blog", label: t("links.blog") },
    { href: "/impact", label: t("links.impact") },
  ] as const;
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLElement | null>>({});

  const isDimmed = (key: string) => hoveredLink !== null && hoveredLink !== key;

  useEffect(() => {
    Object.entries(linkRefs.current).forEach(([key, el]) => {
      if (!el) return;
      gsap.to(el, {
        opacity: isDimmed(key) ? 0.4 : 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }, [hoveredLink]);

  useEffect(() => {
    if (!isMegaMenuOpen) return;

    function handlePointerDown(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMegaMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMegaMenuOpen]);

  return (
    <header
      ref={headerRef}
      onClick={(e) => {
        if (!isMegaMenuOpen) return;
        const toggleEl = linkRefs.current[MEGA_MENU_ID];
        if (toggleEl && toggleEl.contains(e.target as Node)) return;
        setIsMegaMenuOpen(false);
      }}
      className="border-border sticky top-0 z-50 border-b bg-white"
    >
      <Container className="gap-gutter h-header z-50 grid grid-cols-12 items-center">
        <div
          className={clsx(
            logoColStyles({ locale: locale === "fr" ? "fr" : "en" }),
          )}
        >
          <Logo />
        </div>

        <div
          className={clsx(
            navColStyles({ locale: locale === "fr" ? "fr" : "en" }),
          )}
        >
          <nav className="hidden items-center gap-8 xl:flex">
            {NAV_LINKS_BEFORE.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                ref={(el) => {
                  linkRefs.current[href] = el;
                }}
                onMouseEnter={() => setHoveredLink(href)}
                onMouseLeave={() => setHoveredLink(null)}
                className={navLinkStyles({ active: isActive(href) })}
              >
                <NavLinkText label={label} isHovered={hoveredLink === href} />
              </Link>
            ))}
            <button
              type="button"
              ref={(el) => {
                linkRefs.current[MEGA_MENU_ID] = el;
              }}
              onClick={() => setIsMegaMenuOpen((v) => !v)}
              onMouseEnter={() => setHoveredLink(MEGA_MENU_ID)}
              onMouseLeave={() => setHoveredLink(null)}
              aria-expanded={isMegaMenuOpen}
              aria-controls={MEGA_MENU_ID}
              className={clsx(
                navLinkStyles({ active: isActive("/work-with-us") }),
                "gap-1.5",
              )}
            >
              <NavLinkText
                label={t("links.workWithUs")}
                isHovered={hoveredLink === MEGA_MENU_ID}
              />
              <motion.span
                animate={{ rotate: isMegaMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <CaretDownIcon className="h-3 w-3" weight="fill" />
              </motion.span>
            </button>
            {NAV_LINKS_AFTER.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                ref={(el) => {
                  linkRefs.current[href] = el;
                }}
                onMouseEnter={() => setHoveredLink(href)}
                onMouseLeave={() => setHoveredLink(null)}
                className={navLinkStyles({ active: isActive(href) })}
              >
                <NavLinkText label={label} isHovered={hoveredLink === href} />
              </Link>
            ))}
          </nav>

          <div className="hidden h-full items-center xl:flex">
            <LanguageSwitcher />
            <Link
              href="/work-with-us"
              className="bg-impact-blue h-header flex w-[180px] items-center justify-center px-6 py-3 text-sm font-medium text-white"
            >
              {t("cta")}
            </Link>
          </div>

          <MobileNav />
        </div>
      </Container>

      <MegaMenu id={MEGA_MENU_ID} isOpen={isMegaMenuOpen} />
      <MegaMenuBackdrop
        isOpen={isMegaMenuOpen}
        onClick={() => setIsMegaMenuOpen(false)}
      />
    </header>
  );
}
