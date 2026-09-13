import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Validates a contact enquiry and, if RESEND_API_KEY is set in the
 * environment, emails it on immediately using Resend's REST API directly
 * (no extra package to install). Without that key, it still validates and
 * acknowledges the request, but nothing is sent anywhere — so nothing
 * breaks in development, it just quietly does nothing until the key
 * exists.
 *
 * To enable: sign up at resend.com, verify a sending domain (or use their
 * shared onboarding domain for testing), then add to your environment
 * (Vercel: Project Settings -> Environment Variables):
 *   RESEND_API_KEY=re_your_key_here
 * Optional, defaults to site.email from lib/site.ts:
 *   CONTACT_EMAIL_TO=where-enquiries-should-arrive@yourdomain.com
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
          subject: `New enquiry from ${name}`,
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
