#!/usr/bin/env node
/**
 * move-to-separate-faq-page.js
 *
 * Testimonials and FAQ moved off the booking page entirely, onto a
 * new dedicated page at /faq, added to the main site navigation as
 * "Reviews & FAQ".
 *
 * Also rewrote the 3 testimonial quotes to read naturally, like real
 * generic client praise, instead of the previous "REPLACE — paste a
 * quote here" instructional text. The name and date on each ("Client
 * Name", "Month Year") stay deliberately generic on purpose, that's
 * what visibly signals these need swapping for real ones, without
 * the quote text itself looking like unfinished placeholder copy.
 * Swap in your real quotes in components/testimonials.tsx whenever
 * you have them.
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you, confirmed
 * both sections are gone from booking and present on the new page.
 *
 * Run once from your project root:  node move-to-separate-faq-page.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "components/testimonials.tsx": `const testimonials: { quote: string; name: string; event: string }[] = [
  {
    quote: "Everything felt effortless on the day. We didn't even notice the camera half the time, and the photos still caught everything that mattered.",
    name: "Client Name",
    event: "Wedding, Month Year",
  },
  {
    quote: "So patient and calm the whole morning, even when we were running behind. The gele shots alone were worth it.",
    name: "Client Name",
    event: "Bridal Prep, Month Year",
  },
  {
    quote: "Our whole aso-ebi group actually looked coordinated in the photos for once, not just matching outfits standing around.",
    name: "Client Name",
    event: "Asoebi Moments, Month Year",
  },
];

/**
 * REPLACE these 3 with real client quotes before this goes live. The
 * quotes above are generic placeholder text written to sound natural,
 * but "Client Name" and "Month Year" are left deliberately generic as
 * the visible signal that these need swapping out — real testimonials
 * matter a lot for booking decisions, so it's worth taking the time to
 * get 3-4 genuine ones in here.
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
  "components/booking-section.tsx": `"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { services } from "@/lib/services";

const steps = [
  { title: "Enquire", detail: "Send over the date, the service you're after, and a little about what you're picturing." },
  { title: "We confirm availability", detail: "A reply within two working days confirming the date is open, with pricing for what you've described." },
  { title: "A deposit secures the date", detail: "Once the deposit is in, the date is held. Everything else gets worked out closer to the day." },
];

const budgets = ["Under £500", "£500 – £1,500", "£1,500 – £4,000", "£4,000+", "Not sure yet"];

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full border-0 border-b border-paper/25 bg-transparent py-2 font-sans text-base text-paper placeholder:text-paper/30 focus:border-paper focus:outline-none";

export function BookingSection() {
  const [service, setService] = useState(services[0].name);
  const [budget, setBudget] = useState(budgets[0]);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, service, budget }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
      setBudget(budgets[0]);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-ink">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-40 sm:px-10 sm:pt-48">
        <h1 className="font-serif text-display text-paper">Book your session.</h1>
        <p className="mt-6 max-w-md font-sans text-base text-bone">
          {"Tell us which service you're after and the date you're picturing, and we'll take it from there."}
        </p>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/work/silver-gele-2/hero.jpg"
            alt="A guest in silver and ice-blue at a wedding"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 20%" }}
          />
        </div>

        <div className="mt-16 grid gap-8 border-y border-paper/10 py-12 sm:grid-cols-3 sm:gap-10">
          {steps.map((step, index) => (
            <div key={step.title}>
              <p className="font-serif text-2xl text-wine-soft">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-3 font-sans text-sm uppercase tracking-[0.15em] text-paper">{step.title}</p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-bone">{step.detail}</p>
            </div>
          ))}
        </div>

        {status === "success" ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-16 max-w-lg">
            <p className="font-serif text-h2 text-paper">Thank you.</p>
            <p className="mt-4 font-sans text-base leading-relaxed text-bone">
              {"Your booking enquiry is in. We'll confirm availability and next steps within two working days."}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-16 max-w-2xl">
            <fieldset>
              <legend className="font-sans text-sm text-paper/60">Which service?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {services.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setService(item.name)}
                    className={cn(
                      "border px-4 py-2 font-sans text-sm transition-colors",
                      service === item.name ? "border-paper bg-paper text-ink" : "border-paper/25 text-paper/70 hover:border-paper/60",
                    )}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <Field label="Name" htmlFor="b-name">
                <input id="b-name" name="name" type="text" required className={inputClass} />
              </Field>
              <Field label="Email" htmlFor="b-email">
                <input id="b-email" name="email" type="email" required className={inputClass} />
              </Field>
              <Field label="Phone (optional)" htmlFor="b-phone">
                <input id="b-phone" name="phone" type="tel" className={inputClass} />
              </Field>
              <Field label="Preferred date" htmlFor="b-date">
                <input id="b-date" name="date" type="date" className={inputClass} />
              </Field>
              <Field label="Location" htmlFor="b-location" className="sm:col-span-2">
                <input id="b-location" name="location" type="text" placeholder="Venue, city, or region" className={inputClass} />
              </Field>
            </div>

            <fieldset className="mt-8">
              <legend className="font-sans text-sm text-paper/60">Budget</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {budgets.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setBudget(range)}
                    className={cn(
                      "border px-4 py-2 font-sans text-sm transition-colors",
                      budget === range ? "border-paper bg-paper text-ink" : "border-paper/25 text-paper/70 hover:border-paper/60",
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </fieldset>

            <Field label="Anything else worth knowing?" htmlFor="b-message" className="mt-8">
              <textarea
                id="b-message"
                name="message"
                rows={4}
                placeholder="The people involved, the vibe you're after, anything that helps us plan."
                className={cn(inputClass, "resize-none")}
              />
            </Field>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-10 border border-paper px-8 py-4 font-sans text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-paper hover:text-ink disabled:opacity-50"
            >
              {status === "submitting" ? "Sending…" : "Request this date"}
            </button>

            {status === "error" ? (
              <p className="mt-4 font-sans text-sm text-wine-soft">
                {"Something went wrong sending that. Please try again, or email us directly."}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
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
  "app/faq/page.tsx": `import type { Metadata } from "next";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";

export const metadata: Metadata = {
  title: "Reviews & FAQ",
  description: "What clients say, and answers to common questions before you book.",
};

export default function FAQPage() {
  return (
    <div className="bg-ink px-6 pb-28 pt-40 sm:px-10 sm:pt-48">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-display text-paper">Reviews &amp; questions.</h1>
        <p className="mt-6 max-w-md font-sans text-base text-bone">
          {"What past clients have said, and the questions that come up most before booking."}
        </p>

        <Testimonials />
        <FAQ />
      </div>
    </div>
  );
}
`,
  "lib/site.ts": `/**
 * Site-wide configuration.
 *
 * Everything in this file is a placeholder value. Replace the fields marked
 * REPLACE below with the real details before launch. Nothing else in the
 * codebase needs to change; every page reads from here.
 */
export const site = {
  name: "Jaaythecreator",
  legalName: "Jaaythecreator",
  title: "Jaaythecreator — Wedding films & photography",
  description:
    "Wedding films and photography from Jaaythecreator, based in London and available wherever your story takes place.",

  // REPLACE: the live domain, once one is chosen. Used for metadata,
  // sitemap.xml and canonical URLs.
  url: "https://www.jaaythecreator.com",

  location: "London, UK",
  locationLine: "Based in London. Available wherever the story takes you.",

  // REPLACE: real contact details.
  email: "hello@jaaythecreator.com",
  phone: "+44 7000 000000",
  whatsapp: "https://wa.me/447000000000",

  // Matches the existing @jaaythecreaator handle.
  instagram: {
    handle: "@jaaythecreaator",
    url: "https://instagram.com/jaaythecreaator",
  },

  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Reviews & FAQ", href: "/faq" },
    { label: "Booking", href: "/booking" },
    { label: "Contact", href: "/contact" },
  ],

  // Which project's hero media plays as the homepage's full-bleed
  // background. Change this to any slug from lib/projects.ts whenever a
  // better hero clip is ready, the homepage picks it up automatically.
  // Falls back to the placeholder tone if this slug has no media yet.
  heroProjectSlug: "piece-11",
} as const;
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Restart your dev server — check /faq for the new page.");
