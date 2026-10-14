/**
 * Security response headers, applied to every route by `headers()` in
 * next.config.ts.
 *
 * Deliberately conservative. Everything enforced here either cannot change how
 * a page renders or has been checked against what this site actually does. The
 * one header that *can* break a working page — Content-Security-Policy — is
 * sent in report-only mode, so browsers report what it would have blocked
 * without blocking anything. Move it to the enforcing header only once the
 * reports come back empty.
 */

/** Both YouTube embeds (the testimonial modal and the blog body) use this. */
const YOUTUBE = "https://www.youtube-nocookie.com";

/** YouTube thumbnails, already listed in `images.remotePatterns`. */
const YOUTUBE_THUMBS = "https://i.ytimg.com";

/** Sanity's image CDN, already listed in `images.remotePatterns`. */
const SANITY_IMAGE_CDN = "https://cdn.sanity.io";

/**
 * Vercel Analytics' debug build, which only loads in development. In
 * production the script and its beacon are served first-party under
 * `/_vercel/insights/`, which `'self'` already covers, so listing this
 * unconditionally would widen production for nothing.
 */
const VERCEL_ANALYTICS_DEBUG = "https://va.vercel-scripts.com";

/** Sanity's query APIs — `<projectId>.api.sanity.io` and friends. */
const SANITY_API = "https://*.sanity.io";

/** Google's tag and its collection endpoints, for when a tag ID is set. */
const GOOGLE_SCRIPT = "https://www.googletagmanager.com";
const GOOGLE_COLLECT = [
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googletagmanager.com",
  "https://*.google.com",
  "https://*.doubleclick.net",
];

/**
 * Only features this site provably does not use.
 *
 * Nothing the YouTube embeds rely on is listed — `autoplay`, `fullscreen`,
 * `encrypted-media`, `picture-in-picture`, `accelerometer` and `gyroscope` are
 * all deliberately absent, so they keep the browser defaults that work today.
 * Denying them here would silently stop videos playing, which is exactly the
 * sort of breakage a security header should not introduce.
 */
const PERMISSIONS_POLICY = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "payment=()",
  "usb=()",
  "midi=()",
  "serial=()",
  "bluetooth=()",
  "display-capture=()",
  "magnetometer=()",
  "xr-spatial-tracking=()",
  "browsing-topics=()",
].join(", ");

/**
 * A candidate policy, sent report-only.
 *
 * `script-src` and `style-src` carry `'unsafe-inline'` because the site is
 * statically rendered: Next inlines its own bootstrap and streamed-payload
 * scripts, and the strict alternative — a per-request nonce from proxy.ts —
 * would force every page to render dynamically and give up static generation.
 * The directives that cost nothing are still tight.
 */
function contentSecurityPolicy(isDev: boolean): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // 'unsafe-eval' is React's dev-only eval for readable error stacks.
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      GOOGLE_SCRIPT,
      ...(isDev ? ["'unsafe-eval'", VERCEL_ANALYTICS_DEBUG] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", SANITY_IMAGE_CDN, YOUTUBE_THUMBS, ...GOOGLE_COLLECT],
    // Self-hosted — see styles/_fonts.scss.
    "font-src": ["'self'", "data:"],
    // `ws:` is the dev server's hot-reload socket.
    "connect-src": ["'self'", SANITY_API, ...GOOGLE_COLLECT, ...(isDev ? ["ws:", VERCEL_ANALYTICS_DEBUG] : [])],
    "media-src": ["'self'", "blob:"],
    // The YouTube embeds. Without this they would render blank.
    "frame-src": [YOUTUBE],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    // Both forms post to this origin's own route handlers.
    "form-action": ["'self'"],
    "frame-ancestors": ["'self'"],
  };

  return Object.entries(directives)
    .map(([directive, values]) => [directive, ...values].join(" "))
    .join("; ");
}

export function securityHeaders(
  isDev = process.env.NODE_ENV === "development",
): { key: string; value: string }[] {
  return [
    // Two years. `includeSubDomains` and `preload` are deliberately absent:
    // both reach beyond this site — the first to every present and future
    // subdomain, the second effectively permanently — and neither should be
    // inherited from a config file. Add them once every subdomain is known to
    // be HTTPS-only.
    ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000" }]),
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Send the origin cross-site, the full path same-site, nothing on a
    // downgrade to http. This is already most browsers' default.
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // SAMEORIGIN rather than DENY: it stops other sites framing this one,
    // which is the clickjacking risk, without ruling out a same-origin frame.
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
    // Report-only: this blocks nothing. It exists so violations can be seen
    // before any policy is enforced.
    { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy(isDev) },
  ];
}
