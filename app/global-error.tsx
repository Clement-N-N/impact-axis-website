"use client";

import "./globals.css";

// This is the root-level error boundary. It only renders when an error
// escapes every other boundary, including `app/[locale]/layout.tsx` itself,
// which is why it has to supply its own <html>/<body> and can't rely on
// next-intl (no locale has necessarily been resolved at that point). Keep
// its copy static English rather than translated.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col items-center justify-center gap-6 py-32 text-center">
        <div className="flex flex-col gap-3">
          <p className="text-impact-yellow text-sm font-semibold tracking-wide uppercase">
            Something Went Wrong
          </p>
          <h1 className="text-4xl font-semibold text-black">We hit a snag</h1>
          <p className="text-impact-gray mx-auto max-w-md">
            An unexpected error occurred. Please try again, or head back home.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="border-impact-yellow bg-impact-yellow inline-flex items-center justify-center border px-6 py-3 text-sm font-medium text-black"
          >
            Try Again
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- renders outside next-intl's [locale] segment, so next/link's locale-aware Link isn't available here */}
          <a
            href="/"
            className="border-border inline-flex items-center justify-center border bg-white px-6 py-3 text-sm font-medium text-black"
          >
            Back to Home
          </a>
        </div>
      </body>
    </html>
  );
}
