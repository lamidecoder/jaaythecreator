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
    if (prefersReducedMotion() || sessionStorage.getItem("jtc-intro-seen")) return;
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
