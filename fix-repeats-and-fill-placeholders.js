#!/usr/bin/env node
/**
 * fix-repeats-and-fill-placeholders.js
 *
 * 1. piece-11 was showing twice: once as the homepage hero background,
 *    once in the magazine grid. Swapped the grid slot to piece-17
 *    (a fresh, unused piece) — piece-11 still powers the hero,
 *    untouched.
 *
 * 2. piece-12's magazine panel was cropping out people's faces. It's
 *    now noticeably taller (55vh mobile, 90vh desktop, up from
 *    45/55vh) and anchors its crop to the top of the frame instead of
 *    center, so less gets cut off.
 *
 * 3. Filled the two other placeholder spots on the homepage that
 *    were still showing gradient placeholders instead of real
 *    photos: the About teaser image, and the 4 rotating images in
 *    the Services section. Only 3 unique real photos exist right now
 *    (piece-8/9/10), so Services reuses piece-9 and piece-10 across
 *    its 4 entries rather than leaving anything blank. REPLACE any of
 *    these in lib/services.ts once you have a photo that better fits
 *    each specific service.
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node fix-repeats-and-fill-placeholders.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "components/about-teaser.tsx": `import { MediaFrame } from "./media-frame";
import { Reveal } from "./reveal";
import { TransitionLink } from "./transition";

export function AboutTeaser() {
  return (
    <section className="bg-paper px-6 py-24 text-ink sm:px-10 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-12 sm:items-center sm:gap-8">
        <div className="sm:col-span-5">
          <MediaFrame
            media={{
              type: "image",
              aspect: "4:5",
              alt: "Bridal prep styling ahead of a wedding",
              src: "/media/work/piece-8/hero.jpg",
              placeholderTone: 4,
            }}
          />
        </div>
        <Reveal className="sm:col-span-7">
          <h2 className="font-serif text-h1 text-ink">{"Styled where it should be. Honest where it shouldn't."}</h2>
          <p className="mt-6 max-w-prose font-sans text-base leading-relaxed text-ink/70">
            {"A gele takes forty minutes to tie properly, and most people never see that part. We're there for the pins and the folding, not just the finished look."}
          </p>
          <TransitionLink
            href="/about"
            className="mt-8 inline-block font-sans text-xs uppercase tracking-[0.2em] text-ink/70 underline decoration-wine decoration-2 underline-offset-4 transition-colors hover:text-ink"
          >
            More about the studio
          </TransitionLink>
        </Reveal>
      </div>
    </section>
  );
}
`,
  "components/moments-grid.tsx": `"use client";

import { useState } from "react";
import { projects } from "@/lib/projects";
import { TransitionLink } from "./transition";
import { Reveal } from "./reveal";
import { videoMimeType } from "./media-frame";
import { cn } from "@/lib/utils";

/** Slug, grid column span (of 12), panel height, and where object-cover
 * anchors its crop — set by hand here so the layout reads as a
 * magazine page rather than a uniform repeating grid. Add or swap
 * slugs and spans freely; spans in the same row should add up to 12.
 * objectPosition defaults to "center" if omitted. */
const PANELS: { slug: string; span: string; height: string; objectPosition?: string }[] = [
  { slug: "emerald-and-gold", span: "sm:col-span-7", height: "h-[55vh] sm:h-[75vh]" },
  { slug: "the-ivory-hour", span: "sm:col-span-5", height: "h-[55vh] sm:h-[75vh]" },
  { slug: "rose-and-marble", span: "sm:col-span-8", height: "h-[50vh] sm:h-[60vh]" },
  { slug: "piece-17", span: "sm:col-span-4", height: "h-[50vh] sm:h-[60vh]" },
  { slug: "piece-12", span: "sm:col-span-12", height: "h-[55vh] sm:h-[90vh]", objectPosition: "object-top" },
];

export function MomentsGrid() {
  const [hovered, setHovered] = useState<string | null>(null);
  const panels = PANELS.map((p) => {
    const project = projects.find((proj) => proj.slug === p.slug);
    return project ? { ...p, project } : null;
  }).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (panels.length === 0) return null;

  return (
    <section className="bg-ink px-6 pb-28 pt-8 sm:px-10 sm:pt-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl font-serif text-h1 text-paper">Selected moments.</h2>
            <TransitionLink
              href="/work"
              className="font-sans text-xs uppercase tracking-[0.2em] text-paper/60 transition-colors hover:text-paper"
            >
              View all work
            </TransitionLink>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-5">
          {panels.map(({ slug, span, height, objectPosition, project }) => (
            <TransitionLink
              key={slug}
              href={\`/work/\${slug}\`}
              className={\`group relative block overflow-hidden bg-ink \${height} \${span}\`}
              onMouseEnter={() => setHovered(slug)}
              onMouseLeave={() => setHovered(null)}
            >
              {project.hero.src ? (
                project.hero.type === "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]",
                      objectPosition,
                    )}
                  >
                    <source src={project.hero.src} type={videoMimeType(project.hero.src)} />
                  </video>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.hero.src}
                    alt={project.hero.alt}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]",
                      objectPosition,
                    )}
                  />
                )
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-bone/30 to-ink" />
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={\`flex h-14 w-14 items-center justify-center rounded-full border border-paper/40 font-sans text-[10px] uppercase tracking-[0.15em] text-paper backdrop-blur-sm transition-all duration-300 \${
                    hovered === slug ? "scale-110 opacity-100" : "opacity-0 group-hover:opacity-100"
                  }\`}
                >
                  {project.hero.type === "video" ? "Watch" : "View"}
                </span>
              </div>

              <div
                className={\`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 sm:opacity-0 \${
                  hovered === slug ? "sm:opacity-100" : ""
                }\`}
              >
                <p className="font-serif text-lg text-paper sm:text-xl">{project.title}</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-[0.15em] text-paper/60">{project.category}</p>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  "components/services-section.tsx": `"use client";

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
`,
  "lib/services.ts": `export type Service = {
  slug: string;
  name: string;
  description: string;
  detail: string;
  placeholderTone: number;
  /** REPLACE any of these once you have a photo that better represents
   * each specific service — only 3 unique real photos exist right now
   * (piece-8/9/10), so this reuses them across services in the
   * meantime rather than leaving a placeholder gradient. */
  src?: string;
};

export const services: Service[] = [
  {
    slug: "weddings",
    name: "Weddings",
    description: "Full day coverage, start to last dance.",
    detail:
      "Photography and film from the first look through to the send-off, edited to hold together as a full record of the day, not just a highlight reel.",
    placeholderTone: 1,
    src: "/media/work/piece-9/hero.jpg",
  },
  {
    slug: "bridal-prep",
    name: "Bridal Prep",
    description: "The getting-ready hours, styled and kept.",
    detail:
      "The pins, the folding, the last adjustments before anyone steps back to look. Usually the most candid part of the whole day, even though it is the most styled.",
    placeholderTone: 4,
    src: "/media/work/piece-10/hero.jpg",
  },
  {
    slug: "asoebi-moments",
    name: "Asoebi Moments",
    description: "The coordinated family and friend group, celebrated properly.",
    detail:
      "The group everyone matches with deserves its own set of photographs, not a rushed five minutes before the reception starts.",
    placeholderTone: 2,
    src: "/media/work/piece-9/hero.jpg",
  },
  {
    slug: "social-content",
    name: "Social Content",
    description: "Short-form cuts for how people actually watch now.",
    detail:
      "Shot on location, often on mobile, and edited fast for Instagram and TikTok. The same eye, built for a different feed.",
    placeholderTone: 5,
    src: "/media/work/piece-10/hero.jpg",
  },
];
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Restart your dev server to see all four fixes.");
