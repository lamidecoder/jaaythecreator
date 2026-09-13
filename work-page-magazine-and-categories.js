#!/usr/bin/env node
/**
 * work-page-magazine-and-categories.js
 *
 * 1. Homepage: piece-20 replaces piece-17 in the moments grid.
 *    piece-12's panel is now noticeably taller (100vh on desktop, up
 *    from 90vh) since it's portrait footage.
 *
 * 2. Work page rebuilt to match the homepage's magazine style: a new
 *    shared MagazineCard component (also now used by the homepage
 *    grid) replaces the old contain-based cards, with a repeating
 *    span/height pattern so it reads as a real magazine layout no
 *    matter how many pieces are in the current category filter.
 *    Every video/photo uses object-cover, filling its panel
 *    completely. Category filter buttons work exactly as before.
 *
 * 3. Emerald & Gold no longer appears in the Work grid specifically
 *    (its video is the same clip as piece-13, so showing both there
 *    would be a duplicate). It's untouched everywhere else — still on
 *    the homepage, still reachable at /work/emerald-and-gold directly.
 *
 * 4. Categories reassigned exactly as specified:
 *    Wedding: piece-1, 5, 7, 14, 15, 18
 *    Asoebi Moments: piece-11, 12
 *    Bridal Prep: piece-2, 3, 4, 16, 17, 19, 20, 21
 *    Social Content: piece-6
 *    (each piece's "services" field was updated to match too, since
 *    it's shown on that piece's own detail page)
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node work-page-magazine-and-categories.js
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
  height,
  objectPosition,
}: {
  project: Project;
  span: string;
  height: string;
  objectPosition?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <TransitionLink
      href={\`/work/\${project.slug}\`}
      className={cn("group relative block overflow-hidden bg-ink", height, span)}
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
            <MagazineCard key={slug} project={project} span={span} height={height} objectPosition={objectPosition} />
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

/** Repeating span/height rhythm so the grid reads as a magazine page
 * rather than a uniform repeat, no matter how many pieces are in the
 * current filter. Cycles every 5 items. */
const SIZE_PATTERN: { span: string; height: string }[] = [
  { span: "sm:col-span-7", height: "h-[50vh] sm:h-[70vh]" },
  { span: "sm:col-span-5", height: "h-[50vh] sm:h-[70vh]" },
  { span: "sm:col-span-8", height: "h-[45vh] sm:h-[55vh]" },
  { span: "sm:col-span-4", height: "h-[45vh] sm:h-[55vh]" },
  { span: "sm:col-span-12", height: "h-[40vh] sm:h-[50vh]" },
];

export function WorkGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("All");

  const shown = useMemo(() => {
    const base = projects.filter((project) => !EXCLUDED_FROM_WORK.includes(project.slug));
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
            const { span, height } = SIZE_PATTERN[index % SIZE_PATTERN.length];
            return <MagazineCard key={project.slug} project={project} span={span} height={height} />;
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
  "lib/projects.ts": `export type Aspect = "16:9" | "9:16" | "4:5" | "4:3" | "3:4";

export type MediaAsset = {
  type: "video" | "image";
  aspect: Aspect;
  /**
   * Local path once a real file exists, e.g. "/media/work/emerald-and-gold/hero.mp4"
   * or ".../hero.jpg". Leave this out entirely and the site shows its editorial
   * placeholder treatment instead of a broken file, so the grid never looks
   * unfinished while real media is still being added. Run \`npm run media\`
   * after dropping files into media-inbox/ to fill these in automatically,
   * see organize-media.js for details.
   */
  src?: string;
  /** Poster frame shown before a video loads, and used if the video is ever unavailable. */
  poster?: string;
  alt: string;
  /** 1 to 8, picks which placeholder tone to render while src is empty. */
  placeholderTone: number;
};

export type Project = {
  slug: string;
  title: string;
  category: "Wedding" | "Bridal Prep" | "Asoebi Moments" | "Social Content";
  date: string;
  services: string[];
  excerpt: string;
  story: string[];
  hero: MediaAsset;
  /** Grid placement hint for the homepage showcase. */
  layout: "feature" | "wide" | "tall" | "square";
  gallery: MediaAsset[];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "rose-and-marble",
    title: "Rose & Marble",
    category: "Wedding",
    date: "2026-05-30",
    services: ["Wedding"],
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-16/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["REPLACE with the first story paragraph."],
  },

  {
    slug: "piece-10",
    title: "Piece 10", // REPLACE with the real title
    category: "Wedding", // REPLACE
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-10/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["REPLACE with the first story paragraph."],
  },

  {
    slug: "emerald-and-gold",
    title: "Emerald & Gold",
    category: "Bridal Prep",
    date: "2026-06-14",
    services: ["Bridal Prep"],
    excerpt: "A gele tied in under an hour, and every minute of it worth keeping.",
    featured: false,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-13/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "The pins go in one at a time, then the folding starts, then the small adjustments nobody but the stylist notices. Most of that never makes it into anyone's memory of the day.",
      "This one is about that hour: the part before anyone else arrives.",
    ],
  },

  {
    slug: "piece-11",
    title: "Piece 11", // REPLACE with the real title
    category: "Asoebi Moments", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Asoebi Moments"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "9:16",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-11/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-12",
    title: "Piece 12", // REPLACE with the real title
    category: "Asoebi Moments", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Asoebi Moments"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-12/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-13",
    title: "Piece 13", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: false,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-13/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-14",
    title: "Piece 14", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: false,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-14/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-8",
    title: "Piece 8", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-8/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-9",
    title: "Piece 9", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-9/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },
  {
    slug: "piece-1",
    title: "Piece 1", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-1/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-2",
    title: "Piece 2", // REPLACE with the real title
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-2/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-3",
    title: "Piece 3", // REPLACE with the real title
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-3/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-4",
    title: "Piece 4", // REPLACE with the real title
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-4/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-5",
    title: "Piece 5", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-5/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-6",
    title: "Piece 6", // REPLACE with the real title
    category: "Social Content", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Social Content"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-6/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-7",
    title: "Piece 7", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-7/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-15",
    title: "Piece 15", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-15/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-16",
    title: "Piece 16", // REPLACE with the real title
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: false,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-16/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-17",
    title: "Piece 17", // REPLACE with the real title
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-17/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-18",
    title: "Piece 18", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-18/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-19",
    title: "Piece 19", // REPLACE with the real title
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-19/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-20",
    title: "Piece 20", // REPLACE with the real title
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-20/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-21",
    title: "Piece 21", // REPLACE with the real title
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-21/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },







{
  slug: "the-ivory-hour",
  title: "The Ivory Hour",
  category: "Wedding",
  date: "2026-04-25",
  services: ["Wedding"],
  excerpt: "REPLACE with a one-line summary.",
  featured: false,
  layout: "feature",
  hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-14/hero.mp4",
      placeholderTone: 1,
    },
  gallery: [],
  story: ["REPLACE with the first story paragraph."],
},
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string, count = 2) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return projects.slice(0, count);
  const rest = [...projects.slice(index + 1), ...projects.slice(0, index)];
  return rest.slice(0, count);
}

/**
 * Every photo across every project, pulled together automatically for the
 * Gallery page. Anything added to a project here (as its hero image or in
 * its gallery array) shows up on /gallery too, with no separate step.
 * Videos are left out, Gallery is specifically the photography set.
 */
const GALLERY_SIZES = ["large", "medium", "small", "medium"] as const;

export function getGalleryImages() {
  const images: (MediaAsset & { id: string; size: (typeof GALLERY_SIZES)[number] })[] = [];
  let count = 0;
  for (const project of projects) {
    const candidates = [project.hero, ...project.gallery];
    for (const media of candidates) {
      if (media.type !== "image") continue;
      images.push({ ...media, id: \`\${project.slug}-\${count}\`, size: GALLERY_SIZES[count % GALLERY_SIZES.length] });
      count++;
    }
  }
  return images;
}
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Restart your dev server to see everything.");
