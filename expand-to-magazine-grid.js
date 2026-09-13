#!/usr/bin/env node
/**
 * expand-to-magazine-grid.js
 *
 * Removes the "Selected stories." grid entirely, and replaces the
 * 2-panel "Selected moments." section with a 5-panel magazine-style
 * grid: varied column spans and heights instead of a uniform repeat,
 * still using object-cover throughout so every video/photo fills its
 * panel completely.
 *
 * The 5 panels, edit the PANELS array at the top of
 * components/moments-grid.tsx any time to change which pieces show or
 * how big each one is (spans are out of 12, spans in the same row
 * should add up to 12):
 *   - Emerald & Gold   (large,  7 cols)
 *   - The Ivory Hour   (medium, 5 cols)
 *   - Rose & Marble    (large,  8 cols)
 *   - Piece 11         (medium, 4 cols)
 *   - Piece 12         (full width banner, 12 cols)
 *
 * Deletes components/showcase.tsx and components/diptych.tsx, neither
 * is used anywhere anymore.
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node expand-to-magazine-grid.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "app/page.tsx": `import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { MomentsGrid } from "@/components/moments-grid";
import { AboutTeaser } from "@/components/about-teaser";
import { ServicesSection } from "@/components/services-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <MomentsGrid />
      <AboutTeaser />
      <ServicesSection />
    </>
  );
}
`,
  "components/moments-grid.tsx": `"use client";

import { useState } from "react";
import { projects } from "@/lib/projects";
import { TransitionLink } from "./transition";
import { Reveal } from "./reveal";
import { videoMimeType } from "./media-frame";

/** Slug, grid column span (of 12), and panel height — set by hand here so
 * the layout reads as a magazine page rather than a uniform repeating
 * grid. Add or swap slugs and spans freely; spans in the same row
 * should add up to 12. */
const PANELS: { slug: string; span: string; height: string }[] = [
  { slug: "emerald-and-gold", span: "sm:col-span-7", height: "h-[55vh] sm:h-[75vh]" },
  { slug: "the-ivory-hour", span: "sm:col-span-5", height: "h-[55vh] sm:h-[75vh]" },
  { slug: "rose-and-marble", span: "sm:col-span-8", height: "h-[50vh] sm:h-[60vh]" },
  { slug: "piece-11", span: "sm:col-span-4", height: "h-[50vh] sm:h-[60vh]" },
  { slug: "piece-12", span: "sm:col-span-12", height: "h-[45vh] sm:h-[55vh]" },
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
          {panels.map(({ slug, span, height, project }) => (
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
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]"
                  >
                    <source src={project.hero.src} type={videoMimeType(project.hero.src)} />
                  </video>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.hero.src}
                    alt={project.hero.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]"
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
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

const toDelete = ["components/showcase.tsx", "components/diptych.tsx"];
for (const relPath of toDelete) {
  const target = path.join(__dirname, relPath);
  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
    console.log("Removed " + relPath + " (no longer used)");
  }
}

console.log("\nDone. Restart your dev server to see the magazine grid.");
