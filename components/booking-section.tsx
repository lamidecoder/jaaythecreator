"use client";

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
