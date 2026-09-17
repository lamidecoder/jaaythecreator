#!/usr/bin/env node
/**
 * back-to-top-button.js
 *
 * Adds a back-to-top button, appearing once you've scrolled down
 * about 600px, using the same Lenis smooth-scroll motion as the rest
 * of the site rather than an abrupt jump.
 *
 * Worth flagging what I found while working on this: your download
 * protection for images and videos already exists and is already
 * wired in site-wide (components/media-protection.tsx, blocking
 * right-click "Save as" on every image and video on the page). I
 * don't have a record of building that in what I can see of this
 * conversation, so it must be from earlier in this session, but it's
 * there, confirmed working, and didn't need touching. Worth knowing
 * its real limit though: right-click is blocked, but nothing
 * front-end can stop someone determined enough to screenshot,
 * screen-record, or pull the file from browser DevTools directly.
 *
 * Verified against your actual repository: clean type-check, a full
 * production build, and confirmed the button's correct hidden state
 * in the real rendered page before this was sent to you.
 *
 * Run once from your project root:  node back-to-top-button.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "components/smooth-scroll.tsx": `"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
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
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1.2,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);
    window.__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
`,
  "components/back-to-top.tsx": `"use client";

import { useEffect, useState } from "react";

/**
 * Uses the site's own Lenis instance (exposed on window by
 * components/smooth-scroll.tsx) so the scroll-to-top motion matches
 * the same easing as everything else on the page. Falls back to the
 * browser's native smooth scroll if Lenis isn't running, which
 * happens under reduced-motion preferences.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleClick() {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      className={\`fixed bottom-8 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-paper/30 bg-ink/80 text-paper backdrop-blur-sm transition-all duration-300 hover:border-paper hover:bg-ink sm:right-10 \${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }\`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 14L12 8L18 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}
`,
  "components/providers.tsx": `"use client";

import type { ReactNode } from "react";
import { SmoothScroll } from "./smooth-scroll";
import { CursorProvider } from "./cursor";
import { TransitionProvider } from "./transition";
import { GrainOverlay } from "./grain-overlay";
import { IntroLoader } from "./intro-loader";
import { MediaProtection } from "./media-protection";
import { BackToTop } from "./back-to-top";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <CursorProvider>
        <TransitionProvider>
          {children}
          <GrainOverlay />
          <IntroLoader />
          <MediaProtection />
          <BackToTop />
        </TransitionProvider>
      </CursorProvider>
    </SmoothScroll>
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
