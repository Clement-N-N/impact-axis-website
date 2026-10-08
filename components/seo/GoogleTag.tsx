import Script from "next/script";

/**
 * The Google tag (gtag.js) for Google Ads and Google Analytics.
 *
 * Set NEXT_PUBLIC_GOOGLE_TAG_IDS in Vercel to your tag ID(s), comma-separated,
 * e.g. "AW-123456789" for Google Ads or "AW-123456789,G-ABC123DEF4" for Ads
 * and Analytics together, then redeploy. Nothing loads while it is unset.
 */
const TAG_IDS = (process.env.NEXT_PUBLIC_GOOGLE_TAG_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter((id) => /^(AW|G|GT|DC)-[A-Z0-9]+$/i.test(id));

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
