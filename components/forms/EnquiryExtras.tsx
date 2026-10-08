"use client";

import { useId } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { optInCopy, type EnquirySource } from "@/lib/enquiry";
import { trackConversion } from "@/lib/analytics";

/**
 * The bits every enquiry form shares: an unticked "keep me posted" opt-in
 * (marketing needs an active yes) and a honeypot field that people never see
 * but form-filling bots do. The route drops anything with the honeypot set.
 */
export function EnquiryExtras({
  source,
  locale,
  tone = "light",
}: {
  source: EnquirySource;
  locale: Locale;
  tone?: "light" | "plain";
}) {
  const id = useId();
  const copy = optInCopy(source, locale);
  return (
    <>
      <label
        htmlFor={`${id}-newsletter`}
        className={
          tone === "light"
            ? "flex cursor-pointer gap-3 rounded-[14px] border border-black/10 bg-white px-4 py-3.5 text-sm text-black/70 transition-colors hover:border-black/25 has-[:checked]:border-impact-blue/40 has-[:checked]:bg-[#f4f6fc]"
            : "flex cursor-pointer gap-3 text-sm text-black/70"
        }
      >
        <input
          id={`${id}-newsletter`}
          type="checkbox"
          name="newsletter"
          className="accent-impact-blue mt-0.5 size-[18px] shrink-0"
        />
        <span>
          <strong className="text-impact-blue font-semibold">{copy.title}</strong>{" "}
          {copy.body}{" "}
          <Link
            href="/privacy-policy"
            className="text-impact-blue font-medium underline underline-offset-2"
          >
            {copy.privacy}
          </Link>
        </span>
      </label>
      {/* Honeypot: off-screen, not focusable, ignored by password managers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
    </>
  );
}

/** POSTs a form to /api/enquiry. Resolves to "ok", "unavailable" or "error". */
export async function sendEnquiry(body: object): Promise<"ok" | "unavailable" | "error"> {
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const source = (body as { source?: unknown }).source;
      trackConversion("generate_lead", typeof source === "string" ? { form: source } : {});
      return "ok";
    }
    return res.status === 503 ? "unavailable" : "error";
  } catch {
    return "error";
  }
}
