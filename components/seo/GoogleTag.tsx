import Script from "next/script";

/**
 * The Google tag (gtag.js) for Google Ads and Google Analytics.
 *
 * Set NEXT_PUBLIC_GOOGLE_TAG_IDS in Vercel to your tag ID(s), comma-separated,
 * e.g. "AW-123456789" for Google Ads or "AW-123456789,G-ABC123DEF4" for Ads
 * and Analytics together, then redeploy. Nothing loads while it is unset.
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

export function GoogleTag() {
  if (TAG_IDS.length === 0) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${TAG_IDS[0]}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${TAG_IDS.map((id) => `gtag('config', '${id}');`).join("\n")}`}
      </Script>
    </>
  );
}
