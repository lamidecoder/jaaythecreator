"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { services } from "@/lib/services";
import { MediaFrame } from "./media-frame";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function ServicesSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const [active, setActive] = useState(0);
  const current = services[active];
  const Heading = headingLevel;

  return (
    <section className="bg-ink px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Heading className="max-w-xl font-serif text-h1 text-paper">What we offer.</Heading>
        </Reveal>

        <div className="mt-16 grid gap-12 sm:grid-cols-12 sm:gap-10">
          <ul className="sm:col-span-7">
            {services.map((service, index) => (
              <li key={service.slug} className="border-b border-paper/10">
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className="flex w-full items-baseline justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={cn(
                      "font-serif text-2xl transition-colors duration-300 sm:text-3xl",
                      active === index ? "text-paper" : "text-paper/45",
                    )}
                  >
                    {service.name}
                  </span>
                  <span className="hidden max-w-xs shrink-0 font-sans text-sm text-bone sm:block">
                    {service.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="sm:col-span-5">
            <motion.div key={current.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <MediaFrame
                media={{
                  type: "image",
                  aspect: "4:3",
                  alt: current.name,
                  src: current.src,
                  placeholderTone: current.placeholderTone,
                }}
              />
              <p className="mt-4 font-sans text-sm leading-relaxed text-bone">{current.detail}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
