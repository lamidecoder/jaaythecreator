#!/usr/bin/env node
/**
 * add-camera-icon-to-preloader.js
 *
 * Adds a hand-drawn video camera icon beside the site name in the
 * preloader, a simple line-art camcorder silhouette (body, lens,
 * viewfinder) in the same paper color as the text, sized to sit as a
 * proper logo lockup rather than a decorative afterthought. It fades
 * and slides in together with the name as one unit.
 *
 * Rendered the actual icon and the full icon+text pairing as images
 * before sending this to check the shape and the proportions, not
 * just the code.
 *
 * Run once from your project root:  node add-camera-icon-to-preloader.js
 */

const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "components", "intro-loader.tsx");

const content = `"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { prefersReducedMotion } from "@/lib/motion";
import { site } from "@/lib/site";

/** Shown once per browser session on first load only. Click anywhere to skip. */
export function IntroLoader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const alreadySeen = process.env.NODE_ENV !== "development" && sessionStorage.getItem("jtc-intro-seen");
    if (prefersReducedMotion() || alreadySeen) return;
    setVisible(true);

    const start = performance.now();
    const duration = 1400;
    let frame: number;

    function tick(now: number) {
      const pct = Math.min(100, Math.round(((now - start) / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        finish();
      }
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    setLeaving(true);
    sessionStorage.setItem("jtc-intro-seen", "1");
    window.setTimeout(() => setVisible(false), 800);
  }

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      onClick={finish}
      className="fixed inset-0 z-[80] flex cursor-pointer flex-col items-center justify-center gap-8 bg-ink"
      initial={false}
      animate={{ clipPath: leaving ? "inset(0 0 0 100%)" : "inset(0 0 0 0%)" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          className="text-paper sm:h-9 sm:w-9"
          aria-hidden="true"
        >
          <rect x="2" y="6" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.15" />
          <path d="M16 9.8L22 6.3V16.7L16 13.2Z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" />
          <circle cx="8.5" cy="11.5" r="2.6" stroke="currentColor" strokeWidth="1.1" />
          <rect x="4" y="4.3" width="3" height="1.7" rx="0.4" fill="currentColor" />
        </svg>
        <span className="font-serif text-3xl italic tracking-wide text-paper sm:text-4xl">{site.name}</span>
      </motion.div>

      <div className="flex w-40 flex-col items-center gap-3 sm:w-56">
        <div className="h-px w-full overflow-hidden bg-paper/15">
          <motion.div
            className="h-full bg-paper"
            animate={{ width: \`\${progress}%\` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
        <span className="font-sans text-[10px] tracking-[0.3em] text-bone">
          {String(progress).padStart(2, "0")} / 100
        </span>
      </div>
    </motion.div>
  );
}
`;

fs.writeFileSync(target, content);
console.log("Updated components/intro-loader.tsx — camera icon added beside the logo.");
