"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  ArrowRightIcon,
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  MapPinIcon,
  PhoneIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { SocialLinks } from "@/sanity/types";
import { contactContent as c } from "./data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const SOCIALS = [
  { key: "instagram", Icon: InstagramLogoIcon, label: "Instagram" },
  { key: "facebook", Icon: FacebookLogoIcon, label: "Facebook" },
  { key: "x", Icon: XLogoIcon, label: "X" },
  { key: "linkedin", Icon: LinkedinLogoIcon, label: "LinkedIn" },
  { key: "youtube", Icon: YoutubeLogoIcon, label: "YouTube" },
] as const;

type Field = "name" | "email" | "message";

/**
 * Contact: a topic picker and short form beside a navy card of direct
 * contact details.
 *
 * Choosing a topic tailors the message prompt. The site has no mail
 * provider yet, so sending composes the message in the visitor's own
 * email app (addressed, subject set from the topic) rather than pretending
 * to submit; the note under the button says so.
 */
export function ContactSection({
  locale,
  email,
  phone,
  address,
  socialLinks,
}: {
  locale: Locale;
  email: string;
  phone: string;
  address: string;
  socialLinks: SocialLinks;
}) {
  const t = (v: { en: string; fr: string }) => getLocalizedText(v, locale);
  const id = useId();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [topic, setTopic] = useState(c.topics[0].id);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);
  const current = c.topics.find((x) => x.id === topic) ?? c.topics[0];
  const socials = SOCIALS.filter((s) => socialLinks?.[s.key]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        split = SplitText.create(headlineRef.current, {
          type: "lines",
          mask: "lines",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.1,
          delay: 0.1,
        });
      }
      gsap.from("[data-rise]", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.25,
      });
    }, section);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [locale]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };
    const next: Partial<Record<Field, string>> = {};
    (Object.keys(values) as Field[]).forEach((f) => {
      if (!values[f]) next[f] = t(c.errors.required);
    });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = t(c.errors.email);
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    const subject = `${t(current.label)}: ${values.name}`;
    const body = `${values.message}\n\n${values.name}\n${values.email}`;
    window.location.assign(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
    setSent(true);
  }

  const input =
    "w-full rounded-[14px] border border-black/10 bg-white px-4 py-3.5 text-base text-black transition-[border-color,box-shadow] placeholder:text-black/35 focus:border-impact-blue focus:ring-4 focus:ring-impact-blue/10 focus:outline-none aria-[invalid=true]:border-[#B42318]";
  const err = (f: Field) =>
    errors[f] ? (
      <p id={`${id}-${f}-err`} className="mt-1.5 text-sm text-[#B42318]">
        {errors[f]}
      </p>
    ) : null;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-title"
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f4f6fc_100%)] pt-[calc(var(--header-height)+clamp(2.5rem,7vw,5rem))] pb-[clamp(3.5rem,8vw,6rem)]"
    >
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Form. */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          <div className="flex flex-col items-start gap-5">
            <span className="bg-impact-yellow rounded-full px-4 py-1.5 text-sm font-semibold text-black">
              {t(c.eyebrow)}
            </span>
            <h1
              id="contact-title"
              ref={headlineRef}
              className="text-impact-blue text-[clamp(2.75rem,6vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance"
            >
              {t(c.headline)}
            </h1>
            <p className="max-w-[52ch] text-lg text-pretty text-black/70">
              {t(c.intro)}
            </p>
          </div>

          <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
            <fieldset data-rise className="flex flex-col gap-3">
              <legend className="text-impact-blue mb-3 text-sm font-semibold">
                {t(c.topicLabel)}
              </legend>
              <div className="flex flex-wrap gap-2">
                {c.topics.map((x) => (
                  <label
                    key={x.id}
                    className="has-[:checked]:bg-impact-blue has-[:focus-visible]:outline-impact-blue text-impact-blue cursor-pointer rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold transition-colors hover:border-black/25 has-[:checked]:border-transparent has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
                  >
                    <input
                      type="radio"
                      name="topic"
                      value={x.id}
                      checked={topic === x.id}
                      onChange={() => setTopic(x.id)}
                      className="sr-only"
                    />
                    {t(x.label)}
                  </label>
                ))}
              </div>
            </fieldset>

            <div data-rise className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${id}-name`}
                  className="text-impact-blue mb-1.5 block text-sm font-semibold"
                >
                  {t(c.fields.name)}
                </label>
                <input
                  id={`${id}-name`}
                  name="name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${id}-name-err` : undefined}
                  className={input}
                />
                {err("name")}
              </div>
              <div>
                <label
                  htmlFor={`${id}-email`}
                  className="text-impact-blue mb-1.5 block text-sm font-semibold"
                >
                  {t(c.fields.email)}
                </label>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? `${id}-email-err` : undefined
                  }
                  className={input}
                />
                {err("email")}
              </div>
            </div>

            <div data-rise>
              <label
                htmlFor={`${id}-message`}
                className="text-impact-blue mb-1.5 block text-sm font-semibold"
              >
                {t(c.fields.message)}
              </label>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={6}
                placeholder={t(current.prompt)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? `${id}-message-err` : undefined
                }
                className={`${input} resize-y`}
              />
              {err("message")}
            </div>

            <div
              data-rise
              className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5"
            >
              <button
                type="submit"
                className="bg-impact-yellow text-impact-blue focus-visible:outline-impact-blue group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold shadow-[0_14px_30px_-14px_rgb(244_198_0/0.9)] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {t(c.submit)}
                <ArrowRightIcon
                  weight="bold"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </button>
              <p className="text-sm text-black/55">{t(c.submitNote)}</p>
            </div>
            {sent && (
              <p
                role="status"
                className="text-impact-blue rounded-[14px] bg-[#fff6d6] px-4 py-3 text-sm"
              >
                {t(c.sent)}{" "}
                <a href={`mailto:${email}`} className="font-semibold underline">
                  {email}
                </a>
                .
              </p>
            )}
          </form>
        </div>

        {/* Direct details. */}
        <aside
          data-rise
          aria-labelledby="contact-details"
          className="bg-impact-blue relative isolate h-fit overflow-hidden rounded-[28px] p-7 text-white md:p-10 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:col-span-5"
        >
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-[#74b9ff]/30 blur-[90px]"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -left-16 -z-10 size-72 rounded-full bg-[#f4c600]/20 blur-[90px]"
          />
          <h2 id="contact-details" className="text-2xl font-semibold">
            {t(c.details.heading)}
          </h2>
          <ul className="mt-8 flex flex-col gap-6">
            {[
              {
                Icon: EnvelopeSimpleIcon,
                label: t(c.details.email),
                value: email,
                href: `mailto:${email}`,
              },
              {
                Icon: PhoneIcon,
                label: t(c.details.phone),
                value: phone,
                href: `tel:${phone.replace(/\s/g, "")}`,
              },
              {
                Icon: MapPinIcon,
                label: t(c.details.visit),
                value: address.replace(/,\s*$/, ""),
              },
            ].map(({ Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="bg-impact-yellow text-impact-blue inline-flex size-11 shrink-0 items-center justify-center rounded-full">
                  <Icon weight="bold" className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-white/60">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="text-lg font-semibold break-words underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-lg font-semibold">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {socials.length > 0 && (
            <div className="mt-10 border-t border-white/15 pt-6">
              <p className="text-sm text-white/60">{t(c.details.follow)}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {socials.map(({ key, Icon, label }) => (
                  <li key={key}>
                    <a
                      href={socialLinks[key]!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="hover:bg-impact-yellow hover:text-impact-blue inline-flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <Icon weight="fill" className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Container>
    </section>
  );
}
