/**
 * Shared motion primitives. Keeping these in one place is what makes the
 * site's animation feel like one considered voice instead of a different
 * easing curve on every component.
 */

// Matches tailwind.config.ts `transitionTimingFunction.cinematic`.
export const easeCinematic = [0.65, 0, 0.15, 1] as const;
// Matches `transitionTimingFunction.reveal` — a softer settle, used for
// content entrances rather than full-screen transitions.
export const easeReveal = [0.19, 1, 0.22, 1] as const;

export const curtainSeconds = 0.9;

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A quiet, considered entrance for a block of content. Used sparingly. */
export const revealUp = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: easeReveal },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: easeReveal } },
};
