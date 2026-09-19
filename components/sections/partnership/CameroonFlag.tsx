/**
 * Inline SVG rather than the 🇨🇲 regional-indicator emoji on purpose: Windows
 * has no flag glyphs in its emoji font, so Chrome/Edge/Firefox on Windows
 * render that emoji as the bare letters "CM". An SVG looks identical on every
 * platform.
 *
 * Decorative — the dial code beside it carries the meaning, and the country
 * name is exposed to assistive tech by the input's own label.
 */
export function CameroonFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 6 4"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="2" height="4" x="0" fill="#007A5E" />
      <rect width="2" height="4" x="2" fill="#CE1126" />
      <rect width="2" height="4" x="4" fill="#FCD116" />
      <polygon
        fill="#FCD116"
        points="3,1.15 3.2,1.725 3.808,1.737 3.323,2.105 3.5,2.688 3,2.34 2.5,2.688 2.677,2.105 2.192,1.737 2.8,1.725"
      />
    </svg>
  );
}
