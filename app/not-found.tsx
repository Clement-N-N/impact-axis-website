import "./globals.css";

// This root-level not-found.tsx is a fallback for requests that never reach
// a valid `[locale]` segment (for example an invalid locale caught by the
// `notFound()` call in `app/[locale]/layout.tsx`, whose thrown error bubbles
// up past that layout to this parent boundary). It has no next-intl context
// to draw on, so its copy is static English rather than translated. The
// locale-aware 404 that visitors normally see lives at
// `app/[locale]/not-found.tsx`.
export default function NotFound() {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col items-center justify-center gap-6 py-32 text-center">
        <div className="flex flex-col gap-3">
          <p className="text-impact-yellow text-sm font-semibold tracking-wide uppercase">
            404 Error
          </p>
          <h1 className="text-4xl font-semibold text-black">Page Not Found</h1>
          <p className="text-impact-gray mx-auto max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- renders outside next-intl's [locale] segment, so next/link's locale-aware Link isn't available here */}
        <a
          href="/"
          className="border-impact-yellow bg-impact-yellow inline-flex items-center justify-center border px-6 py-3 text-sm font-medium text-black"
        >
          Back to Home
        </a>
      </body>
    </html>
  );
}
