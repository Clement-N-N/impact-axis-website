import { useTranslations } from "next-intl";

/**
 * The first thing in the tab order, so a keyboard or switch user can jump the
 * navbar and mega menu instead of tabbing every link on every page
 * (WCAG 2.4.1 Bypass Blocks).
 *
 * It parks above the viewport and slides down when focused. The usual
 * `sr-only` / `not-sr-only` pair does not work here: `not-sr-only` resets
 * padding, margin and position to their initial values, so the link comes back
 * as bare unstyled text sitting on top of the logo. `fixed` rather than
 * `absolute` so it is still reachable once the page has been scrolled, and
 * z-110 so it clears the mobile header, which is itself z-100.
 *
 * A plain `<a href="#main">` rather than the localised `Link`: the target is a
 * fragment on the page already open, so routing is not involved.
 */
export function SkipLink() {
  const t = useTranslations("nav");

  return (
    <a
      href="#main"
      className="bg-impact-blue focus:outline-impact-yellow fixed top-0 left-0 z-[110] -translate-y-full rounded-br-[14px] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 focus:translate-y-0 focus:outline-3 focus:outline-offset-2"
    >
      {t("links.skipToContent")}
    </a>
  );
}
