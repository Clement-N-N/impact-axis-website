/**
 * Reports a completed form to Google (Ads and Analytics) so ad clicks that
 * turn into enquiries or sign-ups can be counted. Does nothing when the
 * Google tag isn't loaded (no tag ID set, or blocked by the visitor).
 *
 * For a Google Ads conversion action, set NEXT_PUBLIC_GOOGLE_ADS_CONVERSIONS
 * in Vercel to "lead=AW-123/AbC,sign_up=AW-123/XyZ" (the "send_to" values
 * Google Ads shows for each conversion action), then redeploy.
 */
type GtagEvent = "generate_lead" | "sign_up";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const ADS_SEND_TO: Record<string, string> = Object.fromEntries(
  (process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSIONS ?? "")
    .split(",")
    .map((pair) => pair.split("=").map((s) => s.trim()))
    .filter((pair) => pair.length === 2 && pair[0] && pair[1]),
);

export function trackConversion(event: GtagEvent, params: Record<string, string> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
  const sendTo = ADS_SEND_TO[event === "generate_lead" ? "lead" : "sign_up"];
  if (sendTo) window.gtag("event", "conversion", { send_to: sendTo });
}
