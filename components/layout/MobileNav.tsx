"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import clsx from "clsx";
import { CaretDown } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  EcosystemIcon,
  FundersIcon,
  PartnersIcon,
  TalentedIcon,
} from "@/components/icons";
import { Container } from "./Container";
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

const navLinkStyles = clsx(
  "block py-3 transition-colors",
);

export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(false);

  const bar1Ref = useRef<HTMLSpanElement>(null);
  const bar2Ref = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLLIElement | null)[]>([]);
  const submenuRef = useRef<HTMLUListElement>(null);
  const submenuItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const NAV_LINKS = [
    { href: "/", label: t("links.home") },
    { href: "/about", label: t("links.about") },
    { href: "/what-we-do", label: t("links.whatWeDo") },
    { href: "/events", label: t("links.events") },
    { href: "/blog", label: t("links.blog") },
    { href: "/impact", label: t("links.impact") },
  ] as const;

  function close() {
    setIsOpen(false);
    setIsWorkOpen(false);
  }

  // Morphing hamburger <-> X
  useEffect(() => {
    gsap.to(bar1Ref.current, {
      rotate: isOpen ? 45 : 0,
      y: isOpen ? 2 : -3,
      duration: 0.3,
      ease: "power3.inOut",
    });
    gsap.to(bar2Ref.current, {
      rotate: isOpen ? -45 : 0,
      y: isOpen ? -2 : 3,
      duration: 0.3,
      ease: "power3.inOut",
    });
  }, [isOpen]);

  // Panel open/close + staggered link reveal
  useEffect(() => {
    if (isOpen) {
      gsap.set(panelRef.current, { pointerEvents: "auto" });
      gsap.to(panelRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.fromTo(
        linkRefs.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power3.out",
          stagger: 0.05,
          delay: 0.1,
        },
      );
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power3.out",
          delay: 0.1 + linkRefs.current.length * 0.05,
        },
      );
    } else {
      gsap.to(panelRef.current, {
        autoAlpha: 0,
        y: -16,
        duration: 0.3,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(panelRef.current, { pointerEvents: "none" });
        },
      });
    }
  }, [isOpen]);

  // "Work With Us" accordion height
  useEffect(() => {
    if (!submenuRef.current) return;

    if (isWorkOpen) {
      gsap.to(submenuRef.current, {
        height: submenuRef.current.scrollHeight,
        duration: 0.35,
        ease: "power3.inOut",
      });
      gsap.fromTo(
        submenuItemRefs.current,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power3.out",
          stagger: 0.04,
          delay: 0.1,
        },
      );
    } else {
      gsap.to(submenuRef.current, {
        height: 0,
        duration: 0.35,
        ease: "power3.inOut",
      });
      gsap.set(submenuItemRefs.current, { opacity: 0, y: 8 });
    }
  }, [isWorkOpen]);

  useEffect(() => {
    gsap.set(panelRef.current, { autoAlpha: 0, y: -16, pointerEvents: "none" });
    gsap.set(submenuRef.current, { height: 0 });
    gsap.set(submenuItemRefs.current, { opacity: 0, y: 8 });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function press(ref: React.RefObject<HTMLElement | null>) {
    gsap.to(ref.current, { scale: 0.96, duration: 0.1, ease: "power2.out" });
  }

  function release(ref: React.RefObject<HTMLElement | null>) {
    gsap.to(ref.current, { scale: 1, duration: 0.15, ease: "power2.out" });
  }

  return (
    <header className="border-border sticky top-0 z-[100] border-b bg-white xl:hidden">
      <Container className="flex h-header items-center justify-between">
        <Logo />
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          onPointerDown={() => press(toggleRef)}
          onPointerUp={() => release(toggleRef)}
          onPointerLeave={() => release(toggleRef)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="relative flex h-10 w-10 items-center justify-center"
        >
          <span
            ref={bar1Ref}
            className="absolute h-0.5 w-6 rounded-full bg-black"
          />
          <span
            ref={bar2Ref}
            className="absolute h-0.5 w-6 rounded-full bg-black"
          />
        </button>
      </Container>

      <div
        ref={panelRef}
        className="fixed inset-x-0 top-[var(--header-height)] z-[90] overflow-y-auto bg-white"
        style={{ height: "calc(100vh - var(--header-height))" }}
      >
        <Container className="flex h-full flex-col py-4">
          <nav className="flex flex-1 flex-col overflow-y-auto">
            <ul className="flex flex-col gap-1 text-2xl font-medium text-black">
              {NAV_LINKS.slice(0, 3).map(({ href, label }, index) => (
                <li
                  key={href}
                  ref={(el) => {
                    linkRefs.current[index] = el;
                  }}
                >
                  <Link
                    href={href}
                    onClick={close}
                    className={clsx(
                      navLinkStyles,
                      isActive(href) ? "text-impact-blue" : "text-black",
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li
                ref={(el) => {
                  linkRefs.current[3] = el;
                }}
              >
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
                      "h-5 w-5 transition-transform duration-300",
                      isWorkOpen && "rotate-180",
                    )}
                  />
                </button>
                <ul ref={submenuRef} className="overflow-hidden">
                  {MEGA_ITEMS.map(({ key, Icon, href }, index) => (
                    <li
                      key={key}
                      ref={(el) => {
                        submenuItemRefs.current[index] = el;
                      }}
                    >
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
                </ul>
              </li>
              {NAV_LINKS.slice(3).map(({ href, label }, index) => (
                <li
                  key={href}
                  ref={(el) => {
                    linkRefs.current[4 + index] = el;
                  }}
                >
                  <Link
                    href={href}
                    onClick={close}
                    className={clsx(
                      navLinkStyles,
                      isActive(href) ? "text-impact-blue" : "text-black",
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-between border-t border-border py-6">
            <LanguageSwitcher className="h-10 px-4 border border-border rounded-md text-sm font-medium" />
            <Link
              ref={ctaRef}
              href="/contact"
              onClick={close}
              onPointerDown={() => press(ctaRef)}
              onPointerUp={() => release(ctaRef)}
              onPointerLeave={() => release(ctaRef)}
              className="rounded-full bg-impact-blue px-6 py-3 text-sm font-medium text-white"
            >
              {t("cta")}
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}
