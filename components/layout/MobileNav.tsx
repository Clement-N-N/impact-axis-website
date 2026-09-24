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
    href: "/work-with-us/funders-development-partners",
  },
  {
    key: "funders",
    Icon: FundersIcon,
    href: "/work-with-us/employers-corporate-partners",
  },
  {
    key: "ecosystem",
    Icon: EcosystemIcon,
    href: "/work-with-us/education-training-institutions",
  },
  {
    key: "talented",
    Icon: TalentedIcon,
    href: "/work-with-us/mentors-professionals",
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
  const isFirstBarRender = useRef(true);

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

  // Morphing hamburger <-> X.
  // On the very first run this must `set`, not `to`: the bars' resting offsets
  // are declared as inline transforms below so they render correctly before
  // hydration, and animating to them on mount would make the two bars visibly
  // splay apart from a single overlapping line on every page load. Same
  // isFirstRender guard `NavLinkText` in Navbar.tsx already uses.
  useEffect(() => {
    // Both bars converge on y: 0 when open. They previously went to +2 and -2,
    // which left the two strokes 4px apart vertically, so they crossed off
    // their own midpoints and drew a lopsided X with uneven arms. The centres
    // have to coincide for the diagonals to intersect cleanly. Measured
    // identically on Pixel 5, iPhone 13 and Galaxy S9+ before the change, so
    // this was never device-specific.
    const method = isFirstBarRender.current ? gsap.set : gsap.to;
    method(bar1Ref.current, {
      rotate: isOpen ? 45 : 0,
      y: isOpen ? 0 : -3,
      duration: 0.3,
      ease: "power3.inOut",
    });
    method(bar2Ref.current, {
      rotate: isOpen ? -45 : 0,
      y: isOpen ? 0 : 3,
      duration: 0.3,
      ease: "power3.inOut",
    });
    isFirstBarRender.current = false;
  }, [isOpen]);

  // Panel open/close + staggered link reveal.
  // `overwrite: true` matters here: without it, toggling faster than the close
  // tween's 0.3s left the old tween alive, and its onComplete stamped
  // pointerEvents:"none" onto an already-reopened panel — the menu looked open
  // but swallowed every tap, so nothing inside it could close it again.
  // pointerEvents is now driven off React state via className instead of being
  // written by tween callbacks at all.
  useEffect(() => {
    if (isOpen) {
      gsap.to(panelRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
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
        overwrite: true,
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
    gsap.set(panelRef.current, { autoAlpha: 0, y: -16 });
    gsap.set(submenuRef.current, { height: 0 });
    gsap.set(submenuItemRefs.current, { opacity: 0, y: 8 });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.addEventListener("keydown", handleKeyDown);

    // No body/html scroll lock here, on purpose — measured, not assumed.
    //
    // This header is `sticky top-0` inside <body>, and sticky positioning
    // needs a scrolling ancestor to stick within. Every form of scroll lock
    // takes that away: `position: fixed` on <body> and `overflow: hidden` on
    // <html>/<body> both stop the viewport scrolling, at which point the
    // header falls back to its static position. Open the menu part-way down
    // a page and the header — and with it the close button — renders
    // hundreds of pixels above the viewport, so the menu opens but cannot be
    // dismissed. Verified in a real mobile browser: opening at scrollY 900
    // put the toggle at top -895 and a close click timed out.
    //
    // Leaving the page scrollable costs almost nothing: the panel is opaque
    // and covers the viewport below the header, so there is nothing to see
    // moving behind it, and `overscroll-contain` on the panel already stops
    // scrolling inside it from chaining to the page. Keeping the header
    // reachable matters far more than freezing a background nobody can see.
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
          // Without this the button stayed stuck at scale 0.96: on touch, when
          // the browser decides a press is really the start of a scroll it
          // fires pointercancel and neither pointerup nor pointerleave ever
          // arrive, so the press animation had nothing to release it. A mouse
          // never hits this path, which is why it only showed up on a phone.
          onPointerCancel={() => release(toggleRef)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="relative flex h-10 w-10 items-center justify-center"
        >
          {/* Resting offsets live in inline transforms rather than only in the
              GSAP effect, so the two bars read as a hamburger in the
              server-rendered markup instead of overlapping into a single line
              until hydration. GSAP parses inline transforms, so these are also
              the exact values its `y: -3` / `y: 3` resting state writes back. */}
          <span
            ref={bar1Ref}
            style={{ transform: "translateY(-3px)" }}
            className="absolute h-0.5 w-6 rounded-full bg-black"
          />
          <span
            ref={bar2Ref}
            style={{ transform: "translateY(3px)" }}
            className="absolute h-0.5 w-6 rounded-full bg-black"
          />
        </button>
      </Container>

      {/* `invisible opacity-0` is the pre-hydration state and is load-bearing:
          the panel is full-screen and opaque, and GSAP only hides it from an
          effect, so without these classes the server-rendered markup painted a
          white sheet over the whole page until React hydrated — barely visible
          on desktop, very visible on a phone. GSAP's autoAlpha writes both
          properties inline afterwards, so it takes over cleanly from here.
          Height uses dvh, not vh: on mobile `100vh` is measured against the
          viewport with the browser chrome collapsed, which pushed the language
          switcher and CTA at the bottom of the panel below the visible area. */}
      <div
        ref={panelRef}
        className={clsx(
          "invisible fixed inset-x-0 top-[var(--header-height)] z-[90] overflow-y-auto overscroll-contain bg-white opacity-0",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        style={{ height: "calc(100dvh - var(--header-height))" }}
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
              onPointerCancel={() => release(ctaRef)}
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
