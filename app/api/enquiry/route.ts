import { NextResponse } from "next/server";
import { contactContent } from "@/components/sections/contact/data";
import { brevoConfigured, INBOX, sendEmail, subscribe } from "@/lib/brevo";
import { SOURCE_TAG, type EnquiryPayload, type EnquirySource } from "@/lib/enquiry";
import { rateLimited } from "@/lib/rate-limit";
import { BASE_URL } from "@/lib/seo";

/**
 * Receives the Contact and Work With Us forms. For each enquiry it:
 * 1. emails it to info@impact-axis.org, with Reply going to the sender;
 * 2. sends the sender a confirmation in their language;
 * 3. if they ticked "keep me posted", adds them to the Brevo newsletter list.
 * Only step 1 has to succeed for the form to report success.
 *
 * Needs BREVO_API_KEY (and BREVO_LIST_ID for step 3) in Vercel.
 */

const SOURCES = new Set<EnquirySource>(Object.keys(SOURCE_TAG) as EnquirySource[]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let raw: Partial<EnquiryPayload>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Bots fill the hidden field or submit instantly. Pretend it worked so
  // they don't adapt, but send nothing.
  if (clip(raw.website, 200) || (typeof raw.elapsed === "number" && raw.elapsed < 2500)) {
    return NextResponse.json({ ok: true });
  }

  const source = raw.source as EnquirySource;
  const locale = raw.locale === "fr" ? "fr" : "en";
  const e = {
    firstName: clip(raw.firstName, 80),
    lastName: clip(raw.lastName, 80),
    email: clip(raw.email, 200).toLowerCase(),
    phone: clip(raw.phone, 40),
    subject: clip(raw.subject, 200),
    message: clip(raw.message, 5000),
    newsletter: raw.newsletter === true,
  };
  if (!SOURCES.has(source) || !e.firstName || !EMAIL.test(e.email) || !e.message) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (rateLimited(req, "enquiry")) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  if (!brevoConfigured()) {
    console.error("Enquiry received but BREVO_API_KEY is not set.");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const tag = SOURCE_TAG[source];
  const name = [e.firstName, e.lastName].filter(Boolean).join(" ");
  // Contact page subjects are topic ids; show the English label to the team.
  const topic = contactContent.topics.find((t) => t.id === e.subject);
  const subject = source === "contact" ? (topic?.label.en ?? "General enquiry") : e.subject;

  // 1. To the team. Must succeed.
  const rows: [string, string][] = [
    ["From", `${name} <${e.email}>`],
    ["Form", source === "contact" ? "Contact page" : `Work With Us - ${tag}`],
    ["Subject", subject],
    ["Phone", e.phone || "-"],
    ["Language", locale === "fr" ? "French" : "English"],
    ["Newsletter", e.newsletter ? "Yes, opted in" : "No"],
  ];
  try {
    await sendEmail({
      to: [INBOX],
      replyTo: { email: e.email, name },
      subject: `[Website] ${tag}: ${subject} - ${name}`,
      tags: ["enquiry", tag.toLowerCase()],
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${e.message}`,
      html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
        .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><strong>${esc(v)}</strong></td></tr>`)
        .join("")}</table><p style="font-family:Arial,sans-serif;font-size:15px;white-space:pre-wrap;border-left:3px solid #f4c600;padding-left:12px">${esc(e.message)}</p><p style="font-family:Arial,sans-serif;font-size:13px;color:#666">Reply to this email to answer ${esc(e.firstName)} directly.</p>`,
    });
  } catch (error) {
    console.error("Enquiry email to the team failed.", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  // 2 and 3 are courtesies: log failures, don't fail the form.
  const fr = locale === "fr";
  const confirm = fr
    ? {
        subject: "Nous avons bien reçu votre message",
        lines: [
          `Bonjour ${e.firstName},`,
          `Merci d'avoir contacté Impact Axis. Nous avons bien reçu votre message et nous vous répondrons sous deux jours ouvrés.`,
          `Pour ajouter quelque chose, répondez simplement à cet e-mail.`,
          `L'équipe Impact Axis`,
        ],
        yours: "Votre message ",
      }
    : {
        subject: "We've received your message",
        lines: [
          `Hi ${e.firstName},`,
          `Thanks for contacting Impact Axis. We've received your message and will reply within two working days.`,
          `To add anything, just reply to this email.`,
          `The Impact Axis team`,
        ],
        yours: "Your message",
      };

  const courtesies = await Promise.allSettled([
    sendEmail({
      to: [{ email: e.email, name }],
      replyTo: INBOX,
      subject: confirm.subject,
      tags: ["enquiry-confirmation"],
      text: `${confirm.lines.join("\n\n")}\n\n${confirm.yours}:\n${e.message}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#101b62">${confirm.lines
        .map((l) => `<p>${esc(l)}</p>`)
        .join("")}<p style="color:#666;font-size:13px;margin-top:24px">${confirm.yours}:</p><p style="white-space:pre-wrap;border-left:3px solid #f4c600;padding-left:12px;color:#333">${esc(e.message)}</p></div>`,
    }),
    e.newsletter
      ? subscribe({
          email: e.email,
          firstName: e.firstName,
          lastName: e.lastName,
          audience: tag,
          language: locale.toUpperCase(),
          redirectUrl: `${BASE_URL}/${locale}`,
        })
      : Promise.resolve(),
  ]);
  courtesies.forEach((r) => {
    if (r.status === "rejected") console.error("Enquiry follow-up failed.", r.reason);
  });

  return NextResponse.json({ ok: true });
}
