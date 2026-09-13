#!/usr/bin/env node
/**
 * add-testimonials-and-faq.js
 *
 * Adds both to the booking page: testimonials right after the process
 * steps (building trust before the ask), FAQ right before the form
 * (answering objections at the exact moment someone would otherwise
 * hesitate and close the tab).
 *
 * On the testimonials specifically: I don't have your real client
 * quotes, so every one of the 3 placeholders is deliberately written
 * to look obviously unfinished ("REPLACE — paste a real quote..."),
 * not like a plausible-but-fake review. This matters — a fabricated-
 * sounding testimonial left live by accident is a real problem, an
 * obvious placeholder is just an unfinished page. Open
 * components/testimonials.tsx and swap in 3-4 real ones before this
 * goes live, ideally each mentioning something specific rather than
 * generic praise.
 *
 * The FAQ answers are reasonable defaults based on standard wedding
 * photography/videography practice, edit any of them in
 * components/faq.tsx to match your actual policies. One answer
 * (turnaround time) is left as REPLACE since only you know your real
 * numbers.
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node add-testimonials-and-faq.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "components/testimonials.tsx": `const testimonials: { quote: string; name: string; event: string }[] = [
  {
    quote: "REPLACE — paste a real quote from a client here, ideally one that mentions something specific about working with you.",
    name: "Client name",
    event: "Wedding, month/year",
  },
  {
    quote: "REPLACE — a second quote, maybe from a bridal prep or asoebi client rather than a full wedding.",
    name: "Client name",
    event: "Bridal Prep, month/year",
  },
  {
    quote: "REPLACE — a third quote. Even a couple of honest sentences from a WhatsApp message works better than something polished-sounding.",
    name: "Client name",
    event: "Asoebi Moments, month/year",
  },
];

/**
 * REPLACE the placeholder quotes above with real ones before this goes
 * live — as written, every quote here is a deliberately obvious
 * placeholder so nothing risks looking like a fabricated review if it's
 * ever left unedited by mistake. Real testimonials matter a lot for
 * booking decisions, so it's worth taking the time to get 3-4 genuine
 * ones in here rather than leaving these.
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
  "components/faq.tsx": `"use client";

import { useState } from "react";

const faqs: { question: string; answer: string }[] = [
  {
    question: "Do you travel outside London?",
    answer:
      "Yes, available worldwide. Travel and accommodation for anything outside the local area gets added to the quote once we know the venue.",
  },
  {
    question: "How far in advance should we book?",
    answer:
      "As soon as you have a date, ideally 6-12 months ahead for weddings. Bridal prep and asoebi sessions can usually work with less notice, but popular dates still go first.",
  },
  {
    question: "What's included in a booking?",
    answer:
      "Depends on the package, but generally: full coverage for the agreed hours, an edited film and/or gallery, and a private online link to view and download everything once it's ready.",
  },
  {
    question: "How long until we get our photos or film?",
    answer: "REPLACE with your real turnaround time (e.g. \\"4-6 weeks for photos, 8-10 weeks for film\\").",
  },
  {
    question: "Do you need a deposit?",
    answer:
      "Yes, a deposit secures the date once availability is confirmed. The remaining balance is due closer to the day, exact terms confirmed at booking.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-16 border-b border-paper/10 pb-12">
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-paper/40">Common questions</p>
      <div className="mt-6 divide-y divide-paper/10">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-base text-paper"
              >
                {item.question}
                <span className="shrink-0 font-serif text-xl text-paper/40">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen ? (
                <p className="pb-5 pr-8 font-sans text-sm leading-relaxed text-bone">{item.answer}</p>
              ) : null}
            </div>
          );
        })}
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
import { Testimonials } from "./testimonials";
import { FAQ } from "./faq";

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

        <Testimonials />
        <FAQ />

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
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Restart your dev server.");
