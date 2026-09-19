"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRightIcon } from "@phosphor-icons/react";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { SocialLinks } from "@/sanity/types";
import {
  COUNTRIES,
  DEFAULT_COUNTRY_CODE,
  FR_ORDER,
  type Country,
} from "./countries";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Same order and icon set as Footer.tsx, so the two social rows stay
// consistent when a platform is added or removed in Sanity.
const SOCIALS = [
  { key: "instagram", Icon: InstagramLogoIcon, label: "Instagram" },
  { key: "facebook", Icon: FacebookLogoIcon, label: "Facebook" },
  { key: "x", Icon: XLogoIcon, label: "X" },
  { key: "linkedin", Icon: LinkedinLogoIcon, label: "LinkedIn" },
  { key: "youtube", Icon: YoutubeLogoIcon, label: "YouTube" },
] as const satisfies readonly { key: keyof SocialLinks; Icon: unknown; label: string }[];

const inputStyles =
  "border border-border bg-white px-4 py-3 text-black transition-colors placeholder:text-impact-gray focus:border-impact-blue focus:ring-1 focus:ring-impact-blue focus:outline-none";

// This app has no error-state color token. `icon-peach` is the closest
// existing red, but at 3.09:1 on white it fails the 4.5:1 needed for normal
// text — fine for the field border (a non-text indicator needs only 3:1),
// not for the message itself. #B42318 measures 6.57:1 on white; worth
// promoting to a proper --color-error token in globals.css.
const ERROR_TEXT_COLOR = "text-[#B42318]";

const FIELDS = ["firstName", "lastName", "email", "message"] as const;
type FieldName = (typeof FIELDS)[number];

type PartnershipContactProps = {
  formSubject: LocalizedText;
  locale: Locale;
  socialLinks: SocialLinks;
};

export function PartnershipContact({
  formSubject,
  locale,
  socialLinks,
}: PartnershipContactProps) {
  const t = useTranslations("partnership");
  const tFooter = useTranslations("footer");

  const fieldId = useId();
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // COUNTRIES ships sorted by English name; FR_ORDER carries the French
  // collation so "Allemagne" sorts under A rather than wherever "Germany"
  // landed. Both orders are precomputed, so the option sequence is identical
  // on server and client.
  const orderedCountries = useMemo<Country[]>(() => {
    if (locale !== "fr") return COUNTRIES;
    const byCode = new Map(COUNTRIES.map((country) => [country.code, country]));
    return FR_ORDER.map((code) => byCode.get(code)).filter(
      (country): country is Country => Boolean(country),
    );
  }, [locale]);

  const activeSocials = SOCIALS.filter((social) =>
    Boolean(socialLinks?.[social.key]),
  ).map((social) => ({ ...social, url: socialLinks[social.key]! }));

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      // "Contact" / "Social Platforms" are small sub-labels rather than
      // section titles, so they ride along in the details fade instead of
      // each getting their own masked reveal — the same treatment
      // Footer.tsx gives its column headers.
      const fadeTargets = [detailsRef.current, formRef.current].filter(Boolean);

      if (!headingRef.current) return;

      split = SplitText.create(headingRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          if (prefersReducedMotion) {
            gsap.set(fadeTargets, { opacity: 1, y: 0 });
            gsap.set(self.lines, { yPercent: 0 });
            return;
          }

          gsap.set(fadeTargets, { opacity: 0, y: 20 });
          gsap.set(self.lines, { yPercent: 100 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });

          tl.to(self.lines, {
            yPercent: 0,
            duration: 0.6,
            ease: "power4.out",
            stagger: 0.12,
          }).to(
            fadeTargets,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.08,
            },
            "-=0.3",
          );

          return tl;
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const nextErrors: Partial<Record<FieldName, string>> = {};
    for (const field of FIELDS) {
      const value = String(formData.get(field) ?? "").trim();
      if (!value) {
        nextErrors[field] = t("form.required");
        continue;
      }
      // Deliberately permissive: just enough to catch a typo like a missing
      // "@", not a full RFC 5322 check, which rejects valid addresses.
      if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        nextErrors.email = t("form.invalidEmail");
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    // TODO: wire up to a real provider. `newsletter_integration_plan.md`
    // sketches a Brevo-backed server action that this form can reuse.
    setIsSubmitted(true);
    form.reset();
  }

  function describedBy(field: FieldName) {
    return errors[field] ? `${fieldId}-${field}-error` : undefined;
  }

  function fieldClass(field: FieldName) {
    return clsx(inputStyles, errors[field] && "border-icon-peach");
  }

  function renderError(field: FieldName) {
    if (!errors[field]) return null;
    return (
      <p
        id={`${fieldId}-${field}-error`}
        className={clsx("mt-1 text-sm", ERROR_TEXT_COLOR)}
      >
        {errors[field]}
      </p>
    );
  }

  return (
    <section ref={sectionRef} className="py-section w-full bg-white">
      <Container className="gap-gutter grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        <div className="hidden h-full lg:col-span-1 lg:block">
          <div className="mt-[1vw] h-[8px] w-[8px] bg-black" aria-hidden="true" />
        </div>

        <div className="col-span-4 flex flex-col gap-12 md:col-span-3 lg:col-span-4">
          <h2
            ref={headingRef}
            className="text-[clamp(1rem,1.25vw,1.125rem)] font-medium text-black"
          >
            {t("getInTouch")}
          </h2>

          <div ref={detailsRef} className="flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <h3 className="text-[clamp(1rem,1.25vw,1.125rem)] font-medium text-black">
                {t("contactLabel")}
              </h3>
              <a
                href={`mailto:${tFooter("email")}`}
                className="text-impact-gray hover:text-black focus-visible:text-black"
              >
                {tFooter("email")}
              </a>
              <a
                href={`tel:${tFooter("tel").replace(/\s/g, "")}`}
                className="text-impact-gray hover:text-black focus-visible:text-black"
              >
                {tFooter("tel")}
              </a>
            </div>

            {activeSocials.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[clamp(1rem,1.25vw,1.125rem)] font-medium text-black">
                  {t("socialLabel")}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {activeSocials.map(({ key, Icon, label, url }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="focus-visible:outline-impact-blue text-black transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="col-span-4 mt-10 flex flex-col gap-3 md:col-span-5 lg:col-span-6 lg:col-start-7 lg:mt-0"
        >
          {isSubmitted && (
            <p
              role="status"
              className="border-impact-blue text-impact-blue border px-4 py-3"
            >
              {t("form.success")}
            </p>
          )}

          <div className="gap-gutter grid grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col">
              <label htmlFor={`${fieldId}-firstName`} className="sr-only">
                {t("form.firstName")}
              </label>
              <input
                id={`${fieldId}-firstName`}
                name="firstName"
                autoComplete="given-name"
                placeholder={t("form.firstName")}
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={describedBy("firstName")}
                className={fieldClass("firstName")}
              />
              {renderError("firstName")}
            </div>

            <div className="flex flex-col">
              <label htmlFor={`${fieldId}-lastName`} className="sr-only">
                {t("form.lastName")}
              </label>
              <input
                id={`${fieldId}-lastName`}
                name="lastName"
                autoComplete="family-name"
                placeholder={t("form.lastName")}
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={describedBy("lastName")}
                className={fieldClass("lastName")}
              />
              {renderError("lastName")}
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor={`${fieldId}-email`} className="sr-only">
              {t("form.email")}
            </label>
            <input
              id={`${fieldId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t("form.email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy("email")}
              className={fieldClass("email")}
            />
            {renderError("email")}
          </div>

          {/* Country select rather than a flag: a flag does not identify a
              dial code (+1 is the US, Canada and ~20 Caribbean nations; +7 is
              both Russia and Kazakhstan), it tells a screen reader nothing,
              and emoji flags render as bare letters on Windows. The name plus
              code is unambiguous and localized.

              Stacked on mobile: "Cameroon (+237)" and a phone field cannot
              both fit across a ~320px viewport, and min-w-0 keeps the input
              from forcing overflow via its intrinsic minimum width once they
              do sit side by side. */}
          <div className="gap-gutter grid grid-cols-1 sm:grid-cols-[minmax(0,auto)_1fr]">
            <div className="flex min-w-0 flex-col">
              <label htmlFor={`${fieldId}-country`} className="sr-only">
                {t("form.countryLabel")}
              </label>
              <select
                id={`${fieldId}-country`}
                name="countryCode"
                defaultValue={DEFAULT_COUNTRY_CODE}
                autoComplete="tel-country-code"
                className={clsx(inputStyles, "w-full")}
              >
                {orderedCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {`${locale === "fr" ? country.fr : country.en} (+${country.dial})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex min-w-0 flex-col">
              <label htmlFor={`${fieldId}-phone`} className="sr-only">
                {t("form.phone")}
              </label>
              <input
                id={`${fieldId}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel-national"
                placeholder={t("form.phone")}
                className={clsx(inputStyles, "w-full")}
              />
            </div>
          </div>

          {/* Subject and message share one bordered block, as in the design.
              The subject is fixed per audience rather than editable, so it
              travels with the submission as a hidden input. */}
          <div className="border-border flex flex-col border">
            <p className="border-border border-b px-4 py-3 text-black">
              <span className="text-impact-gray">{t("form.subjectLabel")}</span>{" "}
              <span className="underline underline-offset-4">
                {getLocalizedText(formSubject, locale)}
              </span>
            </p>
            <input
              type="hidden"
              name="subject"
              value={getLocalizedText(formSubject, locale)}
            />

            <label htmlFor={`${fieldId}-message`} className="sr-only">
              {t("form.message")}
            </label>
            <textarea
              id={`${fieldId}-message`}
              name="message"
              rows={6}
              placeholder={t("form.message")}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy("message")}
              className={clsx(
                "resize-y bg-white px-4 py-3 text-black transition-colors placeholder:text-impact-gray focus:outline-none",
                errors.message && "border-icon-peach border",
              )}
            />
          </div>
          {renderError("message")}

          <div className="mt-3">
            <Button
              type="submit"
              variant="primary"
              icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
            >
              {t("form.send")}
            </Button>
          </div>
        </form>
      </Container>
    </section>
  );
}
