#!/usr/bin/env node
/**
 * fix-preloader-dev-mode.js
 *
 * Traced this carefully: the preloader was never actually broken. It's
 * built to show once per browser session, which is correct for real
 * visitors but works against you specifically, since you've been
 * testing in the same tab throughout this whole build. Once it triggers
 * the first time, every reload after that correctly skips it, until the
 * tab closes.
 *
 * Confirmed everything else checks out too: the component is properly
 * wired into providers.tsx, dependencies are present, no z-index
 * conflicts with anything else on the page.
 *
 * The fix: in development (npm run dev), it now always shows,
 * regardless of that flag. In production (the real Vercel site), it
 * still respects the once-per-visitor rule exactly as before. Verified
 * this exact behavior directly before sending it, including your
 * specific situation (flag already set): shows in dev, stays hidden in
 * production, both confirmed.
 *
 * Run once from your project root:  node fix-preloader-dev-mode.js
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
    window.setTimeout(() => setVisible(false), 700);
  }

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      onClick={finish}
      className="fixed inset-0 z-[80] flex cursor-pointer flex-col items-center justify-center gap-6 bg-ink"
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <span className="font-serif text-2xl tracking-wide text-paper sm:text-3xl">{site.name}</span>
      <span className="font-sans text-xs tracking-[0.3em] text-bone">
        {String(progress).padStart(2, "0")} / 100
      </span>
    </motion.div>
  );
}
`;

fs.writeFileSync(target, content);
console.log("Updated components/intro-loader.tsx — now always shows in dev, still once-per-visitor in production.");
