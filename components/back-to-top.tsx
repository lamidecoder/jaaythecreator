"use client";

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
      className={`fixed bottom-8 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-paper/30 bg-ink/80 text-paper backdrop-blur-sm transition-all duration-300 hover:border-paper hover:bg-ink sm:right-10 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 14L12 8L18 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}
