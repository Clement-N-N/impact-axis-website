"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import { CaretDownIcon } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";
import type { SocialLinks } from "@/sanity/types";
import { Container } from "./Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MegaMenuBackdrop } from "./MegaMenuBackdrop";

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
      en: "lg:col-span-2 xxl:col-span-2 2xl:col-span-4",
      fr: "lg:col-span-2 xxl:col-span-2 2xl:col-span-3",
    },
  },
  defaultVariants: { locale: "en" },
});

const navColStyles = cva(
  "flex h-full items-center justify-between gap-[40px]",
  {
    variants: {
      locale: {
        en: "lg:col-span-10 xxl:col-span-10 2xl:col-span-8",
        fr: "lg:col-span-10 xxl:col-span-10 2xl:col-span-9",
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

export function Navbar({ socialLinks }: { socialLinks: SocialLinks }) {
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
    { href: "/events", label: t("links.events") },
    { href: "/blog", label: t("links.blog") },
    { href: "/impact", label: t("links.impact") },
  ] as const;
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPointer = useRef<string | null>(null);
  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsMegaMenuOpen(true);
  };
  const closeMenuSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIsMegaMenuOpen(false), 220);
  };
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );
  const headerRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    Object.entries(linkRefs.current).forEach(([key, el]) => {
      if (!el) return;
      const isDimmed = hoveredLink !== null && hoveredLink !== key;
      gsap.to(el, {
        opacity: isDimmed ? 0.4 : 1,
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
        if ((e.target as HTMLElement).closest("[data-mega-toggle]")) return;
        const menuEl = document.getElementById(MEGA_MENU_ID);
        // Clicks inside the menu normally leave it open — but a link is the one
        // exception: following it should close the menu, or it stays open over
        // the page that was just navigated to.
        const followedLink = (e.target as HTMLElement).closest("a");
        if (menuEl && menuEl.contains(e.target as Node) && !followedLink) return;
        setIsMegaMenuOpen(false);
      }}
      className="border-border sticky top-0 z-50 hidden border-b bg-white xl:block"
    >
      {/* Desktop nav  */}
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
            {/* "Work With Us" is a real link to the hub. With a mouse,
                hovering the link (or the menu) opens the mega menu, and
                leaving both closes it after a short grace period. The caret
                is a separate button that toggles the menu, for touch and
                keyboard users, who have no hover. */}
            <span
              className="flex items-center gap-1"
              onPointerEnter={(e) => e.pointerType === "mouse" && openMenu()}
              onPointerLeave={(e) => e.pointerType === "mouse" && closeMenuSoon()}
            >
              <Link
                href="/work-with-us"
                ref={(el) => {
                  linkRefs.current[MEGA_MENU_ID] = el;
                }}
                onMouseEnter={() => setHoveredLink(MEGA_MENU_ID)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => setIsMegaMenuOpen(false)}
                className={navLinkStyles({ active: isActive("/work-with-us") })}
              >
                <NavLinkText
                  label={t("links.workWithUs")}
                  isHovered={hoveredLink === MEGA_MENU_ID}
                />
              </Link>
              <button
                type="button"
                data-mega-toggle
                onPointerDown={(e) => {
                  lastPointer.current = e.pointerType;
                }}
                onClick={() => {
                  // With a mouse, hover has already opened the menu, so a
                  // click should keep it open rather than toggle it shut.
                  // Touch and keyboard (no pointer) toggle as usual.
                  if (lastPointer.current === "mouse") openMenu();
                  else setIsMegaMenuOpen((v) => !v);
                  lastPointer.current = null;
                }}
                aria-expanded={isMegaMenuOpen}
                aria-controls={MEGA_MENU_ID}
                aria-label={t("links.workWithUsMenu")}
                className="focus-visible:outline-impact-blue -m-2 inline-flex items-center justify-center rounded-full p-2 focus-visible:outline-2"
              >
                <motion.span
                  animate={{ rotate: isMegaMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <CaretDownIcon className="h-3 w-3" weight="fill" />
                </motion.span>
              </button>
            </span>
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
              href="/contact"
              className="bg-impact-blue h-header flex w-[180px] items-center justify-center px-6 py-3 text-sm font-medium text-white"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </Container>
      <div
        onPointerEnter={(e) => e.pointerType === "mouse" && isMegaMenuOpen && openMenu()}
        onPointerLeave={(e) => e.pointerType === "mouse" && closeMenuSoon()}
      >
        <MegaMenu id={MEGA_MENU_ID} isOpen={isMegaMenuOpen} socialLinks={socialLinks} />
      </div>
      <MegaMenuBackdrop
        isOpen={isMegaMenuOpen}
        onClick={() => setIsMegaMenuOpen(false)}
      />
    </header>
  );
}
