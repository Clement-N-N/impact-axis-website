"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent/ConsentProvider";

/**
 * The Google tag (gtag.js) for Google Ads and Google Analytics.
 *
 * Set NEXT_PUBLIC_GOOGLE_TAG_IDS in Vercel to your tag ID(s), comma-separated,
 * e.g. "AW-123456789" for Google Ads or "AW-123456789,G-ABC123DEF4" for Ads
 * and Analytics together, then redeploy. Nothing loads while it is unset.
 *
 * Nothing loads before consent either. The tag sets cookies, so under GDPR and
 * the ePrivacy Directive it may not run until the visitor has agreed, and this
 * site serves a French locale. Returning null means no script tag, no
 * dataLayer and no request — which is stricter than Consent Mode alone, since
 * that loads the library immediately and merely asks it to behave. Consent
 * Mode defaults are still sent as the first command so the tag knows the
 * answer the instant it does load, and so the three advertising signals stay
 * denied whatever the visitor chose about analytics.
 */
// Pick the IDs out of whatever was pasted: a bare ID, a comma-separated
// list, a quoted value, a conversion value like "AW-123/AbC" or even Google's
// whole install snippet all work. Duplicates are dropped.
const TAG_IDS = [
  ...new Set(
    (process.env.NEXT_PUBLIC_GOOGLE_TAG_IDS ?? "").toUpperCase().match(/\b(?:AW|G|GT|DC)-[A-Z0-9]{4,}\b/g) ?? [],
  ),
];

if (process.env.NEXT_PUBLIC_GOOGLE_TAG_IDS && TAG_IDS.length === 0) {
  console.warn("NEXT_PUBLIC_GOOGLE_TAG_IDS is set but contains no Google tag ID (AW-…, G-…, GT-…).");
}

/** Whether a tag is configured at all — the banner has nothing to ask without one. */
export const hasGoogleTag = TAG_IDS.length > 0;

export function GoogleTag() {
  const { choice } = useConsent();

  if (!hasGoogleTag || choice !== "granted") return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${TAG_IDS[0]}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted'
});
gtag('js', new Date());
${TAG_IDS.map((id) => `gtag('config', '${id}');`).join("\n")}`}
      </Script>
    </>
  );
}
