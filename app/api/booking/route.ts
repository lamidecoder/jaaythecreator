import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Same pattern as app/api/contact/route.ts — see that file for the full
 * explanation of how to enable this with a RESEND_API_KEY.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const to = process.env.CONTACT_EMAIL_TO || site.email;
    const fields = Object.entries(body || {})
      .filter(([, value]) => typeof value === "string" && value.trim())
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${site.name} website <onboarding@resend.dev>`,
          to,
          reply_to: email,
          subject: `New booking request from ${name}`,
          text: fields,
        }),
      });
      if (!res.ok) {
        console.error("Resend send failed:", await res.text());
      }
    } catch (err) {
      console.error("Resend send error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
