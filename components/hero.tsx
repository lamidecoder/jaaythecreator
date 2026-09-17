"use client";

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
