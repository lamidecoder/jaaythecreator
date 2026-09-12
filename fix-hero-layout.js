#!/usr/bin/env node
/**
 * fix-hero-layout.js
 *
 * Redesigns the hero as a split layout instead of a full-bleed box:
 * text on one side (desktop: left half, mobile: bottom), and a
 * dedicated video panel on the other (desktop: right half, mobile:
 * top 55% of the screen). The video fills its own panel with
 * object-cover, so a portrait clip looks intentional and fills its
 * space properly, instead of floating uncropped in a mostly-empty
 * full-width box with an awkward gap next to the text.
 *
 * Text no longer needs a text-shadow, since it now sits on a plain
 * ink background rather than over the video.
 *
 * Run once from your project root:  node fix-hero-layout.js
 */

const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "components", "hero.tsx");

const content = `"use client";

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
        <div ref={frameRef} className="flex h-full origin-center flex-col overflow-hidden sm:flex-row">
          <div className="relative flex h-[45vh] flex-col justify-end px-6 pb-8 sm:h-full sm:w-1/2 sm:justify-end sm:px-10 sm:pb-24 sm:pt-28">
            <h1
              ref={headlineRef}
              className="max-w-xl font-serif text-display-lg text-paper"
            >
              We keep what the day leaves behind.
            </h1>
            <p ref={subRef} className="mt-6 max-w-md font-sans text-sm text-bone sm:text-base">
              {"Weddings, bridal prep, and asoebi moments. UK-based, available worldwide."}
            </p>
          </div>

          <div className="relative h-[55vh] overflow-hidden bg-ink sm:h-full sm:w-1/2">
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
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent sm:bg-gradient-to-r sm:from-ink/50 sm:via-transparent sm:to-transparent" />
          </div>
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
`;

fs.writeFileSync(target, content);
console.log("Updated components/hero.tsx — hero is now a split text/video layout.");
