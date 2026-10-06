/**
 * Minimal Brevo (api.brevo.com/v3) client for the enquiry route. Server only:
 * it reads BREVO_API_KEY, which must never reach the browser.
 */
// BREVO_API_URL only exists so the requests can be checked against a local stub.
const API = process.env.BREVO_API_URL || "https://api.brevo.com/v3";

export const SENDER = { name: "Impact Axis", email: "info@impact-axis.org" };
export const INBOX = { name: "Impact Axis", email: "info@impact-axis.org" };

export const brevoConfigured = () => Boolean(process.env.BREVO_API_KEY);

async function call(path: string, body: unknown): Promise<Response> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY ?? "",
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return res;
}

async function ensureOk(res: Response, what: string) {
  if (res.ok) return;
  const detail = await res.text().catch(() => "");
  throw new Error(`Brevo ${what} failed (${res.status}): ${detail.slice(0, 300)}`);
}

type Person = { email: string; name?: string };

export async function sendEmail(email: {
  to: Person[];
  replyTo?: Person;
  subject: string;
  html: string;
  text: string;
  tags?: string[];
}) {
  const res = await call("/smtp/email", {
    sender: SENDER,
    to: email.to,
    replyTo: email.replyTo,
    subject: email.subject,
    htmlContent: email.html,
    textContent: email.text,
    tags: email.tags,
  });
  await ensureOk(res, "send email");
}

/**
 * Adds someone who ticked "keep me posted" to the newsletter list.
 *
 * With BREVO_DOI_TEMPLATE_ID set, Brevo first emails them a confirmation link
 * (double opt-in) and only adds them once they click it. AUDIENCE and
 * LANGUAGE are custom contact attributes; if they haven't been created in
 * Brevo yet the call is retried without them rather than losing the sign-up.
 */
export async function subscribe(contact: {
  email: string;
  firstName: string;
  lastName: string;
  audience: string;
  language: string;
  redirectUrl: string;
}): Promise<"added" | "confirm" | "skipped"> {
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!listId) return "skipped";
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);

  // Blank names are left out rather than overwriting a saved one with "".
  const base = Object.fromEntries(
    Object.entries({ FIRSTNAME: contact.firstName, LASTNAME: contact.lastName }).filter(([, v]) => v),
  );
  const full = { ...base, AUDIENCE: contact.audience, LANGUAGE: contact.language };

  const send = (attributes: Record<string, string>) =>
    templateId
      ? call("/contacts/doubleOptinConfirmation", {
          email: contact.email,
          attributes,
          includeListIds: [listId],
          templateId,
          redirectionUrl: contact.redirectUrl,
        })
      : call("/contacts", {
          email: contact.email,
          attributes,
          listIds: [listId],
          updateEnabled: true,
        });

  let res = await send(full);
  if (res.status === 400) res = await send(base);
  await ensureOk(res, "subscribe");
  return templateId ? "confirm" : "added";
}
