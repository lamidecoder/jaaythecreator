"use client";

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
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif text-3xl italic tracking-wide text-paper sm:text-4xl"
      >
        {site.name}
      </motion.span>

      <div className="flex w-40 flex-col items-center gap-3 sm:w-56">
        <div className="h-px w-full overflow-hidden bg-paper/15">
          <motion.div
            className="h-full bg-paper"
            animate={{ width: `${progress}%` }}
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
