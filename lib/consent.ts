/**
 * Analytics consent, with no React or DOM assumptions so it can be read on the
 * server and tested on its own.
 *
 * The Google tag sets cookies, so under GDPR and the ePrivacy Directive it may
 * not load until the visitor has agreed. This site serves a French locale, so
 * that is not optional. The choice is kept in a first-party cookie rather than
 * localStorage so a server render can see it.
 */

export const CONSENT_COOKIE = "ia_analytics_consent";

/**
 * Bumped when what we ask permission for changes, which retires every stored
 * answer: a cookie carrying an older version reads as "not asked yet", so the
 * banner returns rather than leaving someone consented to something they were
 * never shown.
 */
export const CONSENT_VERSION = 1;

/** Six months — long enough not to nag, short enough to stay a real choice. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 182;

export type ConsentChoice = "granted" | "denied";

/** `null` means the visitor has not answered, which is not the same as "no". */
export type ConsentState = ConsentChoice | null;

/** `"1:granted"`. The version travels with the value, not in a second cookie. */
export function serialiseConsent(choice: ConsentChoice): string {
  return `${CONSENT_VERSION}:${choice}`;
}

export function parseConsent(raw: string | undefined | null): ConsentState {
  if (!raw) return null;
  const [version, choice] = raw.split(":");
  if (Number(version) !== CONSENT_VERSION) return null;
  return choice === "granted" || choice === "denied" ? choice : null;
}

/**
 * Do Not Track and Global Privacy Control. Where either is on the visitor has
 * already answered at the browser level, so treat it as a refusal and do not
 * ask. GPC is legally binding in several jurisdictions.
 */
export function prefersNoTracking(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    doNotTrack?: string;
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  };
  const dnt = nav.doNotTrack ?? nav.msDoNotTrack;
  return dnt === "1" || dnt === "yes" || nav.globalPrivacyControl === true;
}

/**
 * `SameSite=Lax` keeps it off cross-site requests. Deliberately not `HttpOnly`:
 * the banner runs in the browser and has to read its own answer back.
 */
export function consentCookieString(choice: ConsentChoice, isSecure: boolean): string {
  return [
    `${CONSENT_COOKIE}=${serialiseConsent(choice)}`,
    "Path=/",
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
    ...(isSecure ? ["Secure"] : []),
  ].join("; ");
}
