import { NextResponse } from "next/server";

/**
 * Validates and acknowledges a booking enquiry. Nothing is sent or stored
 * yet, wire in a real email provider (Resend, Postmark) or CRM below once
 * credentials exist. The form on /contact already calls this route, so once
 * the TODO is filled in, enquiries will start arriving with no other
 * changes needed.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
  }

  // TODO: send the enquiry on. Example with Resend once an API key exists:
  //
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "Jaaythecreator <bookings@yourdomain.com>",
  //   to: "you@yourdomain.com",
  //   subject: `New enquiry from ${name}`,
  //   text: JSON.stringify(body, null, 2),
  // });

  return NextResponse.json({ ok: true });
}
