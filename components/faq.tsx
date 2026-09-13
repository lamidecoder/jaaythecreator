"use client";

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
    answer: "REPLACE with your real turnaround time (e.g. \"4-6 weeks for photos, 8-10 weeks for film\").",
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
