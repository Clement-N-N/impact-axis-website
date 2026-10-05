import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook: POST here on every publish, unpublish or delete, and the
 * whole site refreshes (each page re-renders on its next visit). This is what
 * lets pages stay cached between edits instead of re-rendering every minute.
 *
 * Set SANITY_REVALIDATE_SECRET in Vercel to the same secret as the webhook in
 * Sanity (manage.sanity.io → API → Webhooks). Requests without a valid
 * signature are rejected.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Revalidation is not configured" }, { status: 500 });
  }

  try {
    // `true` waits for Sanity's CDN to have the new content before refreshing.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    // Content is shared across pages (the layout reads social links, the home
    // page reads blog posts), so refresh everything rather than guess.
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (error) {
    console.error("Sanity revalidation webhook failed.", error);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
