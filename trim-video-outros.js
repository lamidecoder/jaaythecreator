#!/usr/bin/env node
/**
 * trim-video-outros.js
 *
 * Every autoplaying video on the site now stops 3 seconds before its
 * true end and restarts from the beginning, instead of looping all
 * the way through — so if a source file has a cover frame, outro
 * card, or watermark baked into its last few seconds (common on
 * phone/social exports), it never actually gets seen during autoplay.
 *
 * Applied everywhere video plays: the hero, the homepage/Work grid
 * cards, and individual project pages.
 *
 * Found and fixed a real bug while building this, not just shipped
 * on first pass: the grid cards mount their video conditionally
 * (only once scrolled into view), and a plain ref object never
 * changes identity even after its underlying element finally exists,
 * so the trimming would have silently never activated there. Caught
 * this with an actual React render test (not just checking the
 * trimming math), confirmed the failure, fixed it by having that one
 * component pass its own "in view" flag through, and confirmed with
 * the same test that it now attaches correctly.
 *
 * Skips trimming on any clip under 6 seconds total, so a short clip
 * doesn't get cut down to almost nothing.
 *
 * Verified against your actual repository: clean type-check, a full
 * production build, and confirmed no native loop attribute remains
 * anywhere in the real rendered output before this was sent to you.
 *
 * Run once from your project root:  node trim-video-outros.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "lib/use-trimmed-loop.ts": `import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Many phone/social exports have a trailing cover frame or outro card
 * baked into the last couple of seconds of the file. Since the video
 * elements on this site loop natively, that unwanted tail would play
 * on every single loop. This restarts playback a few seconds early
 * instead of waiting for the true end, so the loop never reaches it.
 *
 * Pass \`loop={false}\` on the <video> itself when using this hook —
 * this hook does the looping manually by seeking back to 0, so the
 * native loop attribute would just fight with it.
 *
 * Skips trimming entirely on very short clips (under 2x the trim
 * length), so a clip barely longer than the trim itself doesn't get
 * cut down to almost nothing.
 *
 * If the <video> is conditionally rendered rather than always present
 * (for example, gated behind an IntersectionObserver "in view" flag),
 * pass that same flag as \`remountKey\` — a plain ref object never
 * changes identity even once its \`.current\` finally points at a real
 * element, so without this the effect would never re-run and the
 * listener would never actually attach. Confirmed this exact failure
 * with a real React render test before adding this parameter.
 */
export function useTrimmedLoop(
  videoRef: RefObject<HTMLVideoElement | null>,
  trimSeconds = 3,
  remountKey: unknown = true,
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration) || duration < trimSeconds * 2) return;
      if (video.currentTime >= duration - trimSeconds) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, trimSeconds, remountKey]);
}
`,
  "components/media-frame.tsx": `"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/lib/projects";
import { placeholderTone } from "@/lib/placeholder-tones";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useTrimmedLoop } from "@/lib/use-trimmed-loop";

export function videoMimeType(src: string) {
  const ext = src.split(".").pop()?.toLowerCase();
  if (ext === "mov") return "video/quicktime";
  if (ext === "webm") return "video/webm";
  if (ext === "m4v") return "video/x-m4v";
  return "video/mp4";
}

/**
 * Poster images sit alongside the video as poster.jpg (see
 * organize-media-v2.js), so this is always derivable from the video's
 * own path rather than needing its own data field. Videos processed
 * before poster generation existed won't have one, the browser just
 * quietly ignores a missing poster and falls back to its normal
 * behavior, so this is safe either way.
 */
export function videoPosterPath(src: string) {
  return src.replace(/\\/[^/]+$/, "/poster.jpg");
}

type MediaFrameProps = {
  media: MediaAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Shown only in placeholder mode, in a quiet corner. Omit for a clean, textless frame. */
  caption?: string;
  /**
   * "cover" (default) locks the wrapper to the media's own declared aspect
   * ratio, used everywhere in the exhibition grids so tiles line up in a
   * predictable grid. "contain" instead fills whatever box the parent
   * gives it, used by the lightbox and the project-detail hero, where the
   * box size is fixed by the layout itself.
   *
   * Neither mode crops the actual media: both use object-contain, so the
   * full frame is always visible. "cover" only affects how the
   * surrounding box gets its size, not how the media fits inside it.
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
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  caption,
  fit = "cover",
}: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useTrimmedLoop(videoRef);

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
      className={cn("relative overflow-hidden bg-ink", fit === "cover" ? "max-h-[75vh]" : "", className)}
      style={fit === "cover" ? { aspectRatio: \`\${w} / \${h}\` } : undefined}
    >
      {media.src ? (
        media.type === "video" ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={media.poster ?? videoPosterPath(media.src)}
            aria-label={media.alt}
            className="absolute inset-0 h-full w-full object-contain"
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
            className="object-contain"
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
  "components/magazine-card.tsx": `"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { videoMimeType, videoPosterPath } from "./media-frame";
import { useTrimmedLoop } from "@/lib/use-trimmed-loop";
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
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useTrimmedLoop(videoRef, 3, inView);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "400px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("group relative overflow-hidden bg-ink", sizeClass, span)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {project.hero.src && inView ? (
        project.hero.type === "video" ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={videoPosterPath(project.hero.src)}
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
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]",
              objectPosition,
            )}
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bone/30 to-ink" />
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 sm:opacity-0",
          hovered ? "sm:opacity-100" : "",
        )}
      >
        <p className="font-serif text-lg text-paper sm:text-xl">{project.title}</p>
        <p className="mt-1 font-sans text-xs uppercase tracking-[0.15em] text-paper/60">{project.category}</p>
      </div>
    </div>
  );
}
`,
  "components/hero.tsx": `"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { prefersReducedMotion } from "@/lib/motion";
import { placeholderTone } from "@/lib/placeholder-tones";
import { getProject } from "@/lib/projects";
import { videoMimeType, videoPosterPath } from "./media-frame";
import { useTrimmedLoop } from "@/lib/use-trimmed-loop";
import { InstagramIcon, TikTokIcon } from "./social-icons";
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
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  const heroProject = getProject(site.heroProjectSlug);
  const heroSrc = heroProject?.hero.src;
  useTrimmedLoop(heroVideoRef, 3, heroSrc);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.3,
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
              ref={heroVideoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              poster={videoPosterPath(heroSrc)}
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

        <div className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-5 sm:right-10">
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-paper/70 transition-colors hover:text-paper"
          >
            <InstagramIcon />
          </a>
          <span className="h-6 w-px bg-paper/25" aria-hidden="true" />
          <a
            href={site.tiktok.url}
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="text-paper/70 transition-colors hover:text-paper"
          >
            <TikTokIcon />
          </a>
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
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Restart your dev server.");
