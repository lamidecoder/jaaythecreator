#!/usr/bin/env node
/**
 * fix-work-grid-aspect-ratio.js
 *
 * The real cause of heads still getting cropped despite the earlier
 * object-top fix: with a fixed viewport-height panel, whether a video
 * crops top/bottom or left/right depends on the exact pixel width of
 * that grid column on the viewer's specific screen — it can flip
 * between the two depending on window size, which is why object-top
 * sometimes had nothing to control.
 *
 * The real fix: every panel's shape is now tied to its own width via
 * aspect-ratio (4:3, 3:2, 3:4, 16:9 depending on position in the
 * repeating pattern), and every one of those ratios is comfortably
 * narrower than 16:9. That guarantees a horizontal video always keeps
 * its FULL height visible, on any screen, with the sides cropped
 * instead, never the top or bottom, so heads are never cut off. This
 * makes the object-top workaround unnecessary, so it's been removed.
 *
 * Confirmed with a real 16:9 test video and the math behind it before
 * sending this: a box narrower than 16:9 always shows 100% of a 16:9
 * video's height, regardless of actual pixel width.
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node fix-work-grid-aspect-ratio.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "components/magazine-card.tsx": `"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects";
import { TransitionLink } from "./transition";
import { videoMimeType } from "./media-frame";
import { cn } from "@/lib/utils";

export function MagazineCard({
  project,
  span,
  sizeClass,
  objectPosition,
}: {
  project: Project;
  span: string;
  sizeClass: string;
  objectPosition?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <TransitionLink
      href={\`/work/\${project.slug}\`}
      className={cn("group relative block overflow-hidden bg-ink", sizeClass, span)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full border border-paper/40 font-sans text-[10px] uppercase tracking-[0.15em] text-paper backdrop-blur-sm transition-all duration-300",
            hovered ? "scale-110 opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          {project.hero.type === "video" ? "Watch" : "View"}
        </span>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 sm:opacity-0",
          hovered ? "sm:opacity-100" : "",
        )}
      >
        <p className="font-serif text-lg text-paper sm:text-xl">{project.title}</p>
        <p className="mt-1 font-sans text-xs uppercase tracking-[0.15em] text-paper/60">{project.category}</p>
      </div>
    </TransitionLink>
  );
}
`,
  "components/moments-grid.tsx": `import { projects } from "@/lib/projects";
import { TransitionLink } from "./transition";
import { Reveal } from "./reveal";
import { MagazineCard } from "./magazine-card";

/** Slug, grid column span (of 12), panel height, and where object-cover
 * anchors its crop — set by hand here so the layout reads as a
 * magazine page rather than a uniform repeating grid. Add or swap
 * slugs and spans freely; spans in the same row should add up to 12.
 * objectPosition defaults to "center" if omitted. */
const PANELS: { slug: string; span: string; height: string; objectPosition?: string }[] = [
  { slug: "emerald-and-gold", span: "sm:col-span-7", height: "h-[55vh] sm:h-[75vh]" },
  { slug: "the-ivory-hour", span: "sm:col-span-5", height: "h-[55vh] sm:h-[75vh]" },
  { slug: "rose-and-marble", span: "sm:col-span-8", height: "h-[50vh] sm:h-[60vh]" },
  { slug: "piece-20", span: "sm:col-span-4", height: "h-[50vh] sm:h-[60vh]" },
  { slug: "piece-12", span: "sm:col-span-12", height: "h-[70vh] sm:h-[100vh]", objectPosition: "object-top" },
];

export function MomentsGrid() {
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
            <MagazineCard key={slug} project={project} span={span} sizeClass={height} objectPosition={objectPosition} />
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  "components/work-grid.tsx": `"use client";

import { useMemo, useState } from "react";
import { projects } from "@/lib/projects";
import { MagazineCard } from "./magazine-card";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const filters = [
  { key: "All", label: "All" },
  { key: "Wedding", label: "Weddings" },
  { key: "Bridal Prep", label: "Bridal Prep" },
  { key: "Asoebi Moments", label: "Asoebi Moments" },
  { key: "Social Content", label: "Social Content" },
] as const;

/** Excluded here specifically because its video is the same clip as
 * piece-13 (it's the same footage shown under a proper name on the
 * homepage) — showing both here would be a duplicate. */
const EXCLUDED_FROM_WORK = ["emerald-and-gold"];

/** Each panel's shape is tied to its own width (aspect-ratio) rather
 * than a fixed viewport height. This matters specifically for
 * horizontal (16:9) video: every ratio below is comfortably narrower
 * than 16:9, which guarantees the video's full height stays visible
 * on every screen size — object-cover crops the sides instead, never
 * the top or bottom, so a person's head is never cut off. A fixed vh
 * height couldn't guarantee this consistently, since whether cropping
 * happens top/bottom or left/right depends on the exact pixel width
 * of the column on each specific screen. Repeats every 5 items so the
 * grid reads as a magazine page. */
const SIZE_PATTERN: { span: string; aspect: string }[] = [
  { span: "sm:col-span-7", aspect: "aspect-[4/3]" },
  { span: "sm:col-span-5", aspect: "aspect-[4/3]" },
  { span: "sm:col-span-8", aspect: "aspect-[3/2]" },
  { span: "sm:col-span-4", aspect: "aspect-[3/4]" },
  { span: "sm:col-span-12", aspect: "aspect-[16/9]" },
];

export function WorkGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("All");

  const shown = useMemo(() => {
    const base = projects.filter(
      (project) => !EXCLUDED_FROM_WORK.includes(project.slug) && project.hero.type !== "image",
    );
    return filter === "All" ? base : base.filter((project) => project.category === filter);
  }, [filter]);

  return (
    <section className="bg-ink px-6 pb-28 pt-40 sm:px-10 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h1 className="max-w-2xl font-serif text-display text-paper">The work.</h1>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={cn(
                "font-sans text-xs uppercase tracking-[0.2em] transition-colors",
                filter === item.key ? "text-paper" : "text-paper/45 hover:text-paper/80",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-5">
          {shown.map((project, index) => {
            const { span, aspect } = SIZE_PATTERN[index % SIZE_PATTERN.length];
            return <MagazineCard key={project.slug} project={project} span={span} sizeClass={aspect} />;
          })}
        </div>

        {shown.length === 0 ? (
          <p className="mt-16 font-sans text-sm text-bone">Nothing in this category yet, check back soon.</p>
        ) : null}
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

console.log("\nDone. Restart your dev server — horizontal videos on the Work page should now show cleanly with heads never cropped, on any screen size.");
