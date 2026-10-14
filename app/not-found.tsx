import "./globals.css";

// This root-level not-found.tsx is a fallback for requests that never reach
// a valid `[locale]` segment (for example an invalid locale caught by the
// `notFound()` call in `app/[locale]/layout.tsx`, whose thrown error bubbles
// up past that layout to this parent boundary). It has no next-intl context
// to draw on, so its copy is static English rather than translated. The
// locale-aware 404 that visitors normally see lives at
// `app/[locale]/not-found.tsx`.
//
// It mirrors that page's navy treatment so the two cannot look like different
// sites, but deliberately stays plain: no GSAP, no Button component, no fonts
// beyond the stylesheet, because this renders outside every provider and is
// the last thing standing when something upstream has already failed.
export default function NotFound() {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="bg-impact-blue flex min-h-full flex-col justify-center px-6 py-24 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
          <p className="text-impact-yellow text-[11.5px] font-bold tracking-[0.1em] uppercase sm:text-sm sm:tracking-[0.14em]">
            404 Error
          </p>

          <h1 className="mt-4 text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-white">
            Page Not Found
          </h1>

          <p className="mt-8 max-w-[42ch] text-[clamp(1.0625rem,1.45vw,1.25rem)] leading-relaxed text-pretty text-white/85">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>

          {/* The same three ways on as the locale page. Plain anchors: this
              renders outside next-intl's [locale] segment, so the locale-aware
              Link is not available, and the English paths are the safe default
              when the locale could not be resolved. */}
          <ul className="mt-10 grid w-full max-w-[52rem] grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { href: "/en", label: "Home" },
              { href: "/en/work-with-us", label: "Work With Us" },
              { href: "/en/blog", label: "Blog" },
            ].map((destination) => (
              <li key={destination.href}>
                <a
                  href={destination.href}
                  className="flex h-full items-center justify-between gap-3 rounded-[20px] border border-white/20 bg-white/10 px-[22px] py-5 text-left text-[1.0625rem] leading-tight font-semibold tracking-[-0.01em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {destination.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </body>
    </html>
  );
}
