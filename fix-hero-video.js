#!/usr/bin/env node
/**
 * fix-hero-video.js
 *
 * Makes the homepage hero background a real video instead of the
 * gradient placeholder. It plays whichever piece is set as
 * heroProjectSlug in lib/site.ts (piece-11 by default), full-bleed with
 * object-cover, same treatment as any full-bleed cinematic hero.
 *
 * If that slug doesn't exist yet or has no media, it falls back to the
 * placeholder tone automatically, tested both ways before sending this.
 *
 * To use a different piece later: open lib/site.ts and change
 * heroProjectSlug to any other slug from lib/projects.ts, no other
 * changes needed.
 *
 * Run once from your project root:  node fix-hero-video.js
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
        <div ref={frameRef} className="absolute inset-0 origin-center overflow-hidden">
          {heroSrc ? (
            <motion.video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
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
          >
            We keep what the day leaves behind.
          </h1>
          <p ref={subRef} className="mt-6 max-w-md font-sans text-sm text-bone sm:text-base">
            {"Weddings, bridal prep, and asoebi moments. UK-based, available worldwide."}
          </p>
        </div>

        <span
          ref={cueRef}
          className="absolute bottom-8 right-6 font-sans text-[11px] uppercase tracking-[0.25em] text-paper/50 sm:right-10"
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
`,
  "components/media-frame.tsx": `"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/lib/projects";
import { placeholderTone } from "@/lib/placeholder-tones";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function videoMimeType(src: string) {
  const ext = src.split(".").pop()?.toLowerCase();
  if (ext === "mov") return "video/quicktime";
  if (ext === "webm") return "video/webm";
  if (ext === "m4v") return "video/x-m4v";
  return "video/mp4";
}

type MediaFrameProps = {
  media: MediaAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Shown only in placeholder mode, in a quiet corner. Omit for a clean, textless frame. */
  caption?: string;
  /**
   * "cover" (default) locks the wrapper to the media's own aspect ratio and
   * fills it, used everywhere in the exhibition grids. "contain" instead
   * fills whatever box the parent gives it and letterboxes the media inside,
   * used only by the lightbox, where the box size is fixed and the image's
   * own ratio needs to be seen in full rather than cropped.
   */
  fit?: "cover" | "contain";
};

/**
 * Renders one piece of media at its own natural aspect ratio. A 9:16 film
 * stays 9:16, a 4:3 photograph stays 4:3 — nothing here forces a crop to
 * 16:9. When a project has no \`src\` yet, it falls back to one of the
 * studio's placeholder tones instead of a broken file or a stock photo.
 *
 * Video plays via plain native autoplay (autoPlay + muted + playsInline),
 * which every browser handles on its own with no JavaScript required.
 * An earlier version gated playback behind an IntersectionObserver and a
 * manual .play() call to pause off-screen video for performance, that's
 * gone for now in favour of the simpler, more reliable version, it can be
 * reintroduced later once real footage is in and performance tuning
 * actually matters.
 */
export function MediaFrame({
  media,
  className,
  sizes = "100vw",
  priority = false,
  caption,
  fit = "cover",
}: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Safety net only: if the visitor has reduced motion turned on, stop
    // the video right after it mounts rather than fighting the browser
    // to never start it in the first place.
    if (prefersReducedMotion()) {
      videoRef.current?.pause();
    }
  }, []);

  const [w, h] = media.aspect.split(":").map(Number);

  return (
    <div
      className={cn("relative overflow-hidden bg-ink", className)}
      style={fit === "cover" ? { aspectRatio: \`\${w} / \${h}\` } : undefined}
    >
      {media.src ? (
        media.type === "video" ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={media.poster}
            aria-label={media.alt}
            className={cn("absolute inset-0 h-full w-full", fit === "cover" ? "object-cover" : "object-contain")}
          >
            <source src={media.src} type={videoMimeType(media.src)} />
          </video>
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={fit === "cover" ? "object-cover" : "object-contain"}
          />
        )
      ) : (
        <div
          className="absolute inset-0 flex items-end p-4"
          style={{ backgroundImage: placeholderTone(media.placeholderTone) }}
          role="img"
          aria-label={media.alt}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 90px rgba(0,0,0,0.35)" }}
          />
          {caption ? (
            <span className="relative font-sans text-[11px] tracking-wide text-paper/40">
              {caption}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
`,
  "lib/site.ts": `/**
 * Site-wide configuration.
 *
 * Everything in this file is a placeholder value. Replace the fields marked
 * REPLACE below with the real details before launch. Nothing else in the
 * codebase needs to change; every page reads from here.
 */
export const site = {
  name: "Jaaythecreator",
  legalName: "Jaaythecreator",
  title: "Jaaythecreator — Wedding films & photography",
  description:
    "Wedding films and photography from Jaaythecreator, based in London and available wherever your story takes place.",

  // REPLACE: the live domain, once one is chosen. Used for metadata,
  // sitemap.xml and canonical URLs.
  url: "https://www.jaaythecreator.com",

  location: "London, UK",
  locationLine: "Based in London. Available wherever the story takes you.",

  // REPLACE: real contact details.
  email: "hello@jaaythecreator.com",
  phone: "+44 7000 000000",
  whatsapp: "https://wa.me/447000000000",

  // Matches the existing @jaaythecreaator handle.
  instagram: {
    handle: "@jaaythecreaator",
    url: "https://instagram.com/jaaythecreaator",
  },

  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Booking", href: "/booking" },
    { label: "Contact", href: "/contact" },
  ],

  // Which project's hero media plays as the homepage's full-bleed
  // background. Change this to any slug from lib/projects.ts whenever a
  // better hero clip is ready, the homepage picks it up automatically.
  // Falls back to the placeholder tone if this slug has no media yet.
  heroProjectSlug: "piece-11",
} as const;
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Homepage hero now plays piece-11's video, edit heroProjectSlug in lib/site.ts to change which piece.");
