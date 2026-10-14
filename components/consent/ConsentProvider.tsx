"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  CONSENT_COOKIE,
  consentCookieString,
  parseConsent,
  prefersNoTracking,
  type ConsentChoice,
  type ConsentState,
} from "@/lib/consent";

/**
 * `"pending"` is the server's answer and the one used while hydrating: the
 * cookie cannot be read there, and rendering anything else would be a
 * hydration mismatch. `"unanswered"` is a real reading taken in the browser —
 * the visitor genuinely has not been asked — and is the only state that shows
 * the banner. Keeping the two apart is what stops the banner flashing up for
 * someone who answered months ago.
 */
type Snapshot = ConsentChoice | "unanswered" | "suppressed" | "pending";

const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function readCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function getSnapshot(): Snapshot {
  if (prefersNoTracking()) return "suppressed";
  return parseConsent(readCookie(CONSENT_COOKIE)) ?? "unanswered";
}

function getServerSnapshot(): Snapshot {
  return "pending";
}

type ConsentContextValue = {
  /** `null` until the visitor has answered. */
  choice: ConsentState;
  /** False while the cookie is still unknown, which is every server render. */
  ready: boolean;
  /** True when we must not ask at all — Do Not Track or GPC is on. */
  suppressed: boolean;
  setChoice: (choice: ConsentChoice) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

/**
 * Holds the answer and is the only thing that writes the cookie.
 *
 * The cookie is the store, read through `useSyncExternalStore` rather than
 * copied into state inside an effect: React takes the snapshot after hydration
 * and re-renders if it differs, which gives the same result without a
 * render-phase read of `document` or a second source of truth to keep in step.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setChoice = useCallback((next: ConsentChoice) => {
    document.cookie = consentCookieString(next, window.location.protocol === "https:");
    // Mirror the answer to Consent Mode for a tag that is already running.
    window.gtag?.("consent", "update", {
      analytics_storage: next === "granted" ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      choice:
        snapshot === "granted" || snapshot === "denied"
          ? snapshot
          : snapshot === "suppressed"
            ? "denied"
            : null,
      ready: snapshot !== "pending",
      suppressed: snapshot === "suppressed",
      setChoice,
    }),
    [snapshot, setChoice],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const value = useContext(ConsentContext);
  if (!value) throw new Error("useConsent must be used inside ConsentProvider.");
  return value;
}
