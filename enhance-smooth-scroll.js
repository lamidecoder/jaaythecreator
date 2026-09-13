#!/usr/bin/env node
/**
 * enhance-smooth-scroll.js
 *
 * Smooth scrolling was already fully built and wired in (Lenis +
 * GSAP, correct dependencies, required CSS all present, confirmed no
 * errors) — the settings were just subtle enough that it may not
 * have read as a distinct effect. This makes it clearly noticeable:
 * longer duration (1.6s, up from 1.15s) and a stronger ease-out curve,
 * so the momentum and settle are obvious rather than barely-there.
 *
 * If you genuinely see zero difference after this — no lag or glide
 * at all when you scroll — check two things on your end: that
 * `node_modules/lenis` and `node_modules/gsap` actually exist (run
 * `npm install` again if not), and that your OS/browser doesn't have
 * "reduce motion" turned on, which intentionally disables this.
 *
 * Run once from your project root:  node enhance-smooth-scroll.js
 */

const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "components", "smooth-scroll.tsx");

const content = `"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wires Lenis's inertia scrolling into GSAP's ticker so ScrollTrigger-driven
 * sequences (see components/hero.tsx) read the same eased scroll position
 * the visitor feels. Skips itself entirely under reduced motion, falling
 * back to the browser's native scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      touchMultiplier: 1.3,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
`;

fs.writeFileSync(target, content);
console.log("Updated components/smooth-scroll.tsx — smooth scroll effect is now more pronounced.");
