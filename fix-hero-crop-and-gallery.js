#!/usr/bin/env node
/**
 * fix-hero-crop-and-gallery.js
 *
 * Three fixes, all tested with real files before sending:
 *
 * 1. Hero video no longer crops. Switched from object-cover to
 *    object-contain, so a portrait video shows in full (with the ink
 *    background filling the sides), instead of being cropped to fill
 *    a wide frame.
 *
 * 2. Hero text (headline, subtext, "Scroll") now has a text-shadow, so
 *    it stays readable against any video content, not just the old
 *    dark placeholder gradient.
 *
 * 3. Gallery is no longer a separate thing you have to manage. It now
 *    automatically pulls every photo from every project in
 *    lib/projects.ts (both each piece's hero image and anything in its
 *    gallery array). Add a photo to a project, it shows on /gallery
 *    too, no extra step, no separate file to edit.
 *
 * Run once from your project root:  node fix-hero-crop-and-gallery.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "components/hero.tsx": `"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { prefersReducedMotion } from "@/lib/motion";
import { placeholderTone } from "@/lib/placeholder-tones";
import { getProject } from "@/lib/projects";
import { videoMimeType } from "./media-frame";
import { site } from "@/lib/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The one big orchestrated motion moment on the site: as the visitor scrolls
 * past the hero, the frame settles from full-bleed into a rounded panel and
 * the statement clears out of the way, so the showcase feels like a
 * continuation of the same opening shot rather than a new page.
 */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const heroProject = getProject(site.heroProjectSlug);
  const heroSrc = heroProject?.hero.src;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      })
        .to(frameRef.current, { scale: 0.86, borderRadius: 28, ease: "none" }, 0)
        .to(headlineRef.current, { yPercent: -30, opacity: 0, ease: "none" }, 0)
        .to(subRef.current, { yPercent: -18, opacity: 0, ease: "none" }, 0)
        .to(cueRef.current, { opacity: 0, ease: "none" }, 0.04);
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <div ref={frameRef} className="absolute inset-0 origin-center overflow-hidden bg-ink">
          {heroSrc ? (
            <motion.video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-contain"
              animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
              transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
            >
              <source src={heroSrc} type={videoMimeType(heroSrc)} />
            </motion.video>
          ) : (
            <motion.div
              className="absolute inset-0"
              style={{ backgroundImage: placeholderTone(1) }}
              animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
              transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/50" />
        </div>

        <div className="relative flex h-full flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-24">
          <h1
            ref={headlineRef}
            className="max-w-2xl font-serif text-display-lg text-paper"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}
          >
            We keep what the day leaves behind.
          </h1>
          <p
            ref={subRef}
            className="mt-6 max-w-md font-sans text-sm text-bone sm:text-base"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}
          >
            {"Weddings, bridal prep, and asoebi moments. UK-based, available worldwide."}
          </p>
        </div>

        <span
          ref={cueRef}
          className="absolute bottom-8 right-6 font-sans text-[11px] uppercase tracking-[0.25em] text-paper/50 sm:right-10"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}
        >
          Scroll
        </span>
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
    slug: "emerald-and-gold",
    title: "Emerald & Gold",
    category: "Bridal Prep",
    date: "2026-06-14",
    services: ["Bridal Prep"],
    excerpt: "A gele tied in under an hour, and every minute of it worth keeping.",
    story: [
      "The pins go in one at a time, then the folding starts, then the small adjustments nobody but the stylist notices. Most of that never makes it into anyone's memory of the day.",
      "This one is about that hour: the part before anyone else arrives.",
    ],
    hero: { type: "video", aspect: "4:5", alt: "Gele styling in emerald and gold", placeholderTone: 1 },
    layout: "tall",
    gallery: [
      { type: "image", aspect: "4:5", alt: "Detail of the gele fold", placeholderTone: 2 },
      { type: "image", aspect: "4:5", alt: "The finished look, emerald and gold", placeholderTone: 4 },
    ],
    featured: true,
  },
  {
    slug: "the-ivory-hour",
    title: "The Ivory Hour",
    category: "Wedding",
    date: "2026-04-25",
    services: ["Wedding"],
    excerpt: "Full day coverage, from the first look through to the last song.",
    story: [
      "A quiet morning that built into a very loud evening. The film and the gallery both move the same way: slow at the start, faster by the end.",
    ],
    hero: { type: "image", aspect: "4:5", alt: "A bride in an ivory gown ahead of her ceremony", placeholderTone: 4 },
    layout: "feature",
    gallery: [
      { type: "image", aspect: "4:5", alt: "Getting ready ahead of the ceremony", placeholderTone: 6 },
      { type: "image", aspect: "16:9", alt: "The ceremony itself", placeholderTone: 3 },
    ],
    featured: true,
  },
  {
    slug: "lilac-at-dusk",
    title: "Lilac at Dusk",
    category: "Asoebi Moments",
    date: "2026-08-02",
    services: ["Asoebi Moments"],
    excerpt: "The coordinated family look, given its own five minutes before the reception.",
    story: [
      "Everyone matching, everyone glad to be asked to stand still for a moment before the noise starts. This is the set of photographs people actually ask for copies of.",
    ],
    hero: { type: "image", aspect: "9:16", alt: "A coordinated asoebi group in lilac", placeholderTone: 8 },
    layout: "tall",
    gallery: [],
    featured: false,
  },
  {
    slug: "mint-quiet-light",
    title: "Mint, Quiet Light",
    category: "Bridal Prep",
    date: "2025-10-04",
    services: ["Bridal Prep"],
    excerpt: "An afternoon session, styled and shot in low, even light.",
    story: [
      "No ceremony attached to this one, just a styled portrait session built around a single look. Sometimes the outfit is the whole story.",
    ],
    hero: { type: "video", aspect: "4:5", alt: "A styled bridal portrait session in mint", placeholderTone: 3 },
    layout: "wide",
    gallery: [{ type: "image", aspect: "4:5", alt: "Detail shot from the mint session", placeholderTone: 6 }],
    featured: false,
  },
  {
    slug: "magenta",
    title: "Magenta",
    category: "Asoebi Moments",
    date: "2026-07-19",
    services: ["Asoebi Moments"],
    excerpt: "Bold colour, shot to actually hold up in print.",
    story: [
      "Strong colour is easy to get wrong in a photograph, either blown out or muddy. This session was lit and edited specifically to keep the magenta true.",
    ],
    hero: { type: "image", aspect: "4:5", alt: "An asoebi look in magenta", placeholderTone: 2 },
    layout: "wide",
    gallery: [],
    featured: false,
  },
  {
    slug: "scarlet-hour",
    title: "Scarlet Hour",
    category: "Social Content",
    date: "2025-12-20",
    services: ["Social Content"],
    excerpt: "A short-form cut, shot on mobile and edited the same evening.",
    story: [
      "Built for a feed, not a frame. Same eye, different pace, different aspect ratio, out within hours instead of weeks.",
    ],
    hero: { type: "video", aspect: "9:16", alt: "A short-form reel in red", placeholderTone: 5 },
    layout: "tall",
    gallery: [],
    featured: false,
  },
  {
    slug: "rose-and-marble",
    title: "Rose & Marble",
    category: "Wedding",
    date: "2026-09-05",
    services: ["Wedding", "Bridal Prep"],
    excerpt: "A wedding that started with a bridal prep session the morning before.",
    story: [
      "Two sessions, one story: the quieter portrait sitting the day before, then the wedding itself. The gallery holds both together as one set.",
    ],
    hero: { type: "image", aspect: "4:5", alt: "A bride in rose tones against a marble backdrop", placeholderTone: 6 },
    layout: "feature",
    gallery: [
      { type: "image", aspect: "4:5", alt: "The bridal prep sitting the day before", placeholderTone: 4 },
      { type: "image", aspect: "16:9", alt: "The wedding day itself", placeholderTone: 8 },
    ],
    featured: true,
  },
  {
    slug: "violet-garden",
    title: "Violet Garden",
    category: "Asoebi Moments",
    date: "2026-05-30",
    services: ["Asoebi Moments", "Social Content"],
    excerpt: "A garden setting, a coordinated look, and a short cut made for sharing.",
    story: [
      "Shot as a full session and cut twice: a longer gallery for keeping, a short vertical edit for sharing the same afternoon.",
    ],
    hero: { type: "video", aspect: "4:5", alt: "An asoebi look shot in a garden setting", placeholderTone: 7 },
    layout: "wide",
    gallery: [],
    featured: false,
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
  "components/gallery-grid.tsx": `"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { getGalleryImages } from "@/lib/projects";
import { MediaFrame } from "./media-frame";
import { Lightbox } from "./lightbox";
import { Reveal } from "./reveal";

const sizeSpan: Record<string, string> = {
  full: "col-span-2 sm:col-span-12",
  large: "sm:col-span-6",
  medium: "col-span-2 sm:col-span-5",
  small: "sm:col-span-4",
};

export function GalleryGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const galleryImages = getGalleryImages();

  return (
    <section className="bg-ink px-6 pb-28 pt-40 sm:px-10 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h1 className="max-w-2xl font-serif text-display text-paper">Gallery.</h1>
          <p className="mt-6 max-w-md font-sans text-base text-bone">
            A closer look at the photography, outside the context of any one wedding.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-flow-row-dense sm:grid-cols-12 sm:gap-5">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className={\`text-left \${sizeSpan[image.size]}\`}
              aria-label={\`Open \${image.alt}\`}
            >
              <MediaFrame media={image} />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null ? (
          <Lightbox images={galleryImages} index={openIndex} onClose={() => setOpenIndex(null)} onIndexChange={setOpenIndex} />
        ) : null}
      </AnimatePresence>
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

console.log("\nDone. lib/gallery.ts is no longer used by the Gallery page, it's safe to ignore or delete.");
