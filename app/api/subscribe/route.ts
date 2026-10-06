import { NextResponse } from "next/server";
import { brevoConfigured, subscribe } from "@/lib/brevo";
import { rateLimited } from "@/lib/rate-limit";
import { BASE_URL } from "@/lib/seo";

/**
 * Footer "Join the movement" sign-up: adds the person to the Brevo newsletter
 * list (BREVO_LIST_ID), via a confirmation email when BREVO_DOI_TEMPLATE_ID
 * is set. Signing up here is itself the opt-in, so there's no checkbox.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Honeypot or instant submit: a bot. Pretend it worked, do nothing.
  if (clip(raw.website, 200) || (typeof raw.elapsed === "number" && raw.elapsed < 2000)) {
    return NextResponse.json({ ok: true, confirm: false });
  }

  const locale = raw.locale === "fr" ? "fr" : "en";
  const email = clip(raw.email, 200).toLowerCase();
  if (!EMAIL.test(email)) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (rateLimited(req, "subscribe")) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  if (!brevoConfigured() || !Number(process.env.BREVO_LIST_ID)) {
    console.error("Newsletter sign-up received but BREVO_API_KEY or BREVO_LIST_ID is not set.");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  let result;
  try {
    result = await subscribe({
      email,
      firstName: clip(raw.firstName, 80),
      lastName: clip(raw.lastName, 80),
      audience: "Newsletter",
      language: locale.toUpperCase(),
      redirectUrl: `${BASE_URL}/${locale}`,
    });
  } catch (error) {
    console.error("Newsletter sign-up failed.", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, confirm: result === "confirm" });
}
