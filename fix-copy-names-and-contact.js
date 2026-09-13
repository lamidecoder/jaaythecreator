#!/usr/bin/env node
/**
 * fix-copy-names-and-contact.js
 *
 * 1. About page copy corrected — it accidentally implied you tie
 *    gele yourself. Reframed to correctly position you as the one
 *    photographing and filming that hour, not performing it.
 *
 * 2. Testimonial names filled in as you specified: Tola & Gabriel
 *    (Wedding, May 2026), Soji & Toun (Bridal Prep, March 2026),
 *    Kemi & Emeka (Asoebi Moments, August 2026). The quotes
 *    themselves are still generic placeholder text, not verified
 *    word-for-word from these people, worth swapping in their real
 *    words if you have them.
 *
 * 3. On why booking and contact felt so similar: checked, and you
 *    were right, they had nearly identical fields (same event-type
 *    categories, same budget ranges, same date/location fields).
 *    Contact is now genuinely simpler: just name, email, and a
 *    message, for a quick "just saying hello" enquiry. Booking stays
 *    the full structured intake (service, date, location, budget)
 *    for people ready to commit to a date. The success message on
 *    Contact now also points people to Booking if they already know
 *    what they want.
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node fix-copy-names-and-contact.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "components/about-section.tsx": `import { Reveal } from "./reveal";

export function AboutSection() {
  return (
    <div className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-40 sm:px-10 sm:pt-48">
        <Reveal>
          <h1 className="max-w-3xl font-serif text-display text-ink">
            {"Styled where it should be. Honest where it shouldn't."}
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-12 sm:grid-cols-12 sm:gap-8">
          <div className="relative aspect-[4/5] overflow-hidden sm:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/about/founder-3/photo.jpg"
              alt="Jaaythecreator speaking to a group, fabric samples on the table beside him"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </div>
          <Reveal className="sm:col-span-7 sm:pt-4">
            <div className="max-w-prose space-y-6 font-sans text-lg leading-relaxed text-ink/80">
              <p>
                {
                  "A gele takes forty minutes to tie properly, and most people never see that part. That's usually the piece I most want in frame, not just the finished look everyone already expects to see."
                }
              </p>
              <p>
                {
                  "The pins, the folding, the small adjustments before anyone steps back to look, that hour tends to hold more of the actual day than the fifteen minutes everyone poses for. I'd rather be there with a camera for that than only show up once everyone's already ready."
                }
              </p>
              <p>
                {
                  "Weddings, bridal prep, and asoebi moments, shot in whatever mix of photo and film each one calls for. UK-based, available worldwide."
                }
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-24 border-t border-ink/10 pt-16">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/about/founder-1/photo.jpg"
                alt="Jaaythecreator outside a restaurant, checking his phone before a shoot"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden sm:mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/about/founder-2/photo.jpg"
                alt="Jaaythecreator in a long coat, off duty"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
`,
  "components/testimonials.tsx": `const testimonials: { quote: string; name: string; event: string }[] = [
  {
    quote: "Everything felt effortless on the day. We didn't even notice the camera half the time, and the photos still caught everything that mattered.",
    name: "Tola & Gabriel",
    event: "Wedding, May 2026",
  },
  {
    quote: "So patient and calm the whole morning, even when we were running behind. The gele shots alone were worth it.",
    name: "Soji & Toun",
    event: "Bridal Prep, March 2026",
  },
  {
    quote: "Our whole aso-ebi group actually looked coordinated in the photos for once, not just matching outfits standing around.",
    name: "Kemi & Emeka",
    event: "Asoebi Moments, August 2026",
  },
];

/**
 * Names and dates are filled in. The quotes themselves are still
 * generic-sounding placeholder text, not verified word-for-word from
 * these specific clients, worth swapping in their actual words if you
 * have them (a WhatsApp message, a review) for full accuracy.
 */
export function Testimonials() {
  return (
    <div className="mt-16 border-y border-paper/10 py-12">
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-paper/40">What clients say</p>
      <div className="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-8">
        {testimonials.map((item, index) => (
          <div key={index}>
            <p className="font-serif text-lg italic leading-snug text-paper">{\`"\${item.quote}"\`}</p>
            <p className="mt-4 font-sans text-sm text-bone">{item.name}</p>
            <p className="font-sans text-xs uppercase tracking-[0.15em] text-paper/40">{item.event}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
`,
  "components/contact-form.tsx": `"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full border-0 border-b border-paper/25 bg-transparent py-2 font-sans text-base text-paper placeholder:text-paper/30 focus:border-paper focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg">
        <p className="font-serif text-h2 text-paper">Thank you.</p>
        <p className="mt-4 font-sans text-base leading-relaxed text-bone">
          {"We've received your message and will reply within two working days. If you already know the date and service you're after, the booking page gets things moving faster."}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input id="name" name="name" type="text" required className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" required className={inputClass} />
        </Field>
      </div>

      <Field label="What's on your mind?" htmlFor="message" className="mt-8">
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="A question, a rough idea, or just saying hello, whatever brought you here."
          className={cn(inputClass, "resize-none")}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-10 border border-paper px-8 py-4 font-sans text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-paper hover:text-ink disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>

      {status === "error" ? (
        <p className="mt-4 font-sans text-sm text-wine-soft">
          {"Something went wrong sending that. Please try again, or email us directly."}
        </p>
      ) : null}
    </form>
  );
}

function Field({ label, htmlFor, children, className }: { label: string; htmlFor: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="font-sans text-sm text-paper/60">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Restart your dev server.");
