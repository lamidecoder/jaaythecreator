import { NextResponse } from "next/server";

/**
 * Validates and acknowledges a booking request. Nothing is sent or stored
 * yet, wire in a real email provider (Resend, Postmark) or CRM below once
 * credentials exist. See app/api/contact/route.ts for the same pattern.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
  }

  // TODO: send the booking request on, e.g. with Resend once an API key exists:
  //
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "Jaaythecreator <bookings@yourdomain.com>",
  //   to: "you@yourdomain.com",
  //   subject: `New booking request from ${name}`,
  //   text: JSON.stringify(body, null, 2),
  // });

  return NextResponse.json({ ok: true });
}
