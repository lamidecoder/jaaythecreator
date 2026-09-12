#!/usr/bin/env node
/**
 * fix-hero-and-video.js
 *
 * Two real bugs, patched directly:
 *
 * 1. Hero headline overflow: the hero text was capped at 11rem inside a
 *    48rem box and forced uppercase. Uppercase text is wider, so together
 *    that made "We keep what the day leaves behind." wrap into far more
 *    lines than the hero has room for, pushing the top lines off-screen.
 *    Now capped at 7.8rem in a 42rem box, no forced uppercase.
 *
 * 2. Video not playing: the <source> tag always claimed type="video/mp4"
 *    regardless of the real file. A .MOV file was being served with an
 *    MP4 label, so the browser refused to load it. The type is now read
 *    from the actual file extension.
 *
 *    One thing this can't fix: if your phone recorded in HEVC ("High
 *    Efficiency") instead of H.264 ("Most Compatible"), Chrome cannot
 *    decode that video at all, no matter what MIME type is declared.
 *    If a clip still won\'t play after this patch, check your phone's
 *    camera format setting, or re-export/convert that one file to H.264
 *    MP4 before dropping it back into media-inbox.
 *
 * Run once from your project root:  node fix-hero-and-video.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "tailwind.config.ts": `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, deliberately-chosen near-black. Not a generic desaturated
        // grey (#111) standing in for black — this one has an espresso
        // undertone that reads as a colour choice, not a filler value.
        ink: "#15110D",
        // Warm ivory used for the site's "breathing" sections (About,
        // Services) rather than as the default background.
        paper: "#F3EEE3",
        // Muted warm grey-beige for secondary text on dark sections.
        bone: "#DDD4C4",
        // The single sparing accent: a deep oxblood, never used as the
        // main colour of a large surface or a full paragraph of text.
        wine: "#6E2A2C",
        "wine-soft": "#C99A93",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(3rem, 9vw, 8.5rem)", { lineHeight: "0.98", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.8rem, 10vw, 7.8rem)", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
        h1: ["clamp(2.25rem, 5.5vw, 4.25rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        h2: ["clamp(1.75rem, 3.6vw, 3rem)", { lineHeight: "1.1" }],
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.65, 0, 0.15, 1)",
        reveal: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      transitionDuration: {
        curtain: "900ms",
      },
      maxWidth: {
        prose: "62ch",
      },
    },
  },
  plugins: [],
};

export default config;
`,
  "components/hero.tsx": `"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { prefersReducedMotion } from "@/lib/motion";
import { placeholderTone } from "@/lib/placeholder-tones";

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
          <motion.div
            className="absolute inset-0"
            style={{ backgroundImage: placeholderTone(1) }}
            animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
            transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
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

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/lib/projects";
import { placeholderTone } from "@/lib/placeholder-tones";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

function videoMimeType(src: string) {
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
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }
        if (!prefersReducedMotion()) {
          video.play().catch(() => {
            // Autoplay can be blocked before the first user interaction on
            // some browsers; the poster frame stays visible in that case.
          });
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
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
            muted
            loop
            playsInline
            preload="none"
            poster={media.poster}
            aria-label={media.alt}
            className={cn("absolute inset-0 h-full w-full", fit === "cover" ? "object-cover" : "object-contain")}
            data-in-view={inView}
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
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Your dev server should pick these up automatically.");
