"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useConsent } from "./ConsentProvider";
import { hasGoogleTag } from "@/components/seo/GoogleTag";

/**
 * Asks once, then never again.
 *
 * Built for a phone first: a full-width sheet across the bottom with both
 * answers side by side and large enough to hit, widening to a centred bar from
 * `md`. It is not a modal and does not trap focus — nothing behind it is
 * tracking anything yet, and trapping someone in a consent dialog so they can
 * go and read the privacy policy is its own accessibility problem.
 *
 * `role="region"` with a label rather than `role="dialog"`, for the same
 * reason: it is a part of the page a screen reader user can reach and act on,
 * not something demanding an answer before anything else may happen.
 *
 * Accept and Decline are given equal visual weight. A greyed-out "decline"
 * beside a bright "accept" is a dark pattern, and under GDPR a consent that was
 * nudged is not freely given.
 */
export function CookieBanner() {
  const t = useTranslations("cookies");
  const { choice, ready, suppressed, setChoice } = useConsent();

  // With no tag configured there is nothing to consent to, and asking would be
  // a cookie banner for cookies that do not exist.
  if (!hasGoogleTag || !ready || suppressed || choice !== null) return null;

  return (
    <div
      role="region"
      aria-label={t("label")}
      className="fixed inset-x-0 bottom-0 z-[105] px-4 pb-4 md:px-6 md:pb-6"
    >
      <div className="bg-impact-blue mx-auto flex max-w-4xl flex-col gap-4 rounded-[20px] border border-white/15 p-5 text-white shadow-[0_24px_60px_-24px_rgb(16_27_98/0.8)] md:flex-row md:items-center md:gap-6 md:p-6">
        <p className="text-sm leading-relaxed text-pretty text-white/90">
          {t("message")}{" "}
          <Link
            href="/privacy-policy"
            className="decoration-impact-yellow underline underline-offset-4 hover:text-white"
          >
            {t("privacyLink")}
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setChoice("granted")}
            className="bg-impact-yellow focus-visible:outline-impact-yellow flex-1 rounded-[12px] px-5 py-3 text-sm font-semibold text-black transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 md:flex-none"
          >
            {t("accept")}
          </button>
          <button
            type="button"
            onClick={() => setChoice("denied")}
            className="flex-1 rounded-[12px] border border-white/35 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:flex-none"
          >
            {t("decline")}
          </button>
        </div>
      </div>
    </div>
  );
}
