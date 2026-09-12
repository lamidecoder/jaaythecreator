"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const eventTypes = ["Wedding", "Bridal Prep", "Asoebi Moments", "Social Content", "Other"];
const budgets = ["Under £2,000", "£2,000 – £4,000", "£4,000 – £7,000", "£7,000+", "Not sure yet"];

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full border-0 border-b border-paper/25 bg-transparent py-2 font-sans text-base text-paper placeholder:text-paper/30 focus:border-paper focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [eventType, setEventType] = useState(eventTypes[0]);
  const [budget, setBudget] = useState(budgets[0]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, eventType, budget }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
      setEventType(eventTypes[0]);
      setBudget(budgets[0]);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg">
        <p className="font-serif text-h2 text-paper">Thank you.</p>
        <p className="mt-4 font-sans text-base leading-relaxed text-bone">
          {"We've received your message and will reply within two working days. In the meantime, feel free to look through more of the work."}
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
        <Field label="Phone (optional)" htmlFor="phone">
          <input id="phone" name="phone" type="tel" className={inputClass} />
        </Field>
        <Field label="Event date" htmlFor="date">
          <input id="date" name="date" type="date" className={inputClass} />
        </Field>
        <Field label="Location" htmlFor="location" className="sm:col-span-2">
          <input id="location" name="location" type="text" placeholder="Venue, city, or region" className={inputClass} />
        </Field>
      </div>

      <fieldset className="mt-8">
        <legend className="font-sans text-sm text-paper/60">Event type</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setEventType(type)}
              className={cn(
                "border px-4 py-2 font-sans text-sm transition-colors",
                eventType === type ? "border-paper bg-paper text-ink" : "border-paper/25 text-paper/70 hover:border-paper/60",
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </fieldset>

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

      <Field label="What are you looking for?" htmlFor="message" className="mt-8">
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us a little about the day and what matters most to you."
          className={cn(inputClass, "resize-none")}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-10 border border-paper px-8 py-4 font-sans text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-paper hover:text-ink disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Start your story"}
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
