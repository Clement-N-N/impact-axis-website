import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { client } from "@/sanity/client";
import { SOCIAL_LINKS_QUERY } from "@/sanity/queries";
import type { SocialLinks } from "@/sanity/types";
import "../globals.css";
import "@/styles/_fonts.scss";
import "@/styles/_base.scss";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Impact Axis — Empowering Young African Talent",
    template: "%s | Impact Axis",
  },
  description:
    "Giving young Africans the skills, judgment, and confidence employers actually need.",
  openGraph: {
    type: "website",
    siteName: "Impact Axis",
    title: "Impact Axis — Empowering Young African Talent",
    description:
      "Giving young Africans the skills, judgment, and confidence employers actually need.",
    images: [
      {
        url: "/logos/impact_axis_white_transparent.png",
        width: 1200,
        height: 630,
        alt: "Impact Axis Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Impact Axis — Empowering Young African Talent",
    description:
      "Giving young Africans the skills, judgment, and confidence employers actually need.",
    images: ["/logos/impact_axis_white_transparent.png"],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

async function getSocialLinks(): Promise<SocialLinks> {
  try {
    const result = await client.fetch(SOCIAL_LINKS_QUERY, {}, { next: { revalidate: 60 } });
    if (result && typeof result === "object") return result as SocialLinks;
  } catch (error) {
    console.error("Failed to fetch social links from Sanity.", error);
  }
  return {};
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const socialLinks = await getSocialLinks();

  return (
    <html lang={locale} className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar socialLinks={socialLinks} />
          <MobileNav />
          <main>{children}</main>
          <Footer socialLinks={socialLinks} />
          {process.env.NODE_ENV === "development" && (
            <>
              <LocalizationDebuggerLoader />
              <DesignGridOverlayLoader />
            </>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

async function LocalizationDebuggerLoader() {
  const { LocalizationDebugger } = await import(
    "@/components/dev/LocalizationDebugger"
  );
  return <LocalizationDebugger />;
}

async function DesignGridOverlayLoader() {
  const { DesignGridOverlay } = await import(
    "@/components/dev/DesignGridOverlay"
  );
  return <DesignGridOverlay />;
}
