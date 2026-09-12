#!/usr/bin/env node
/**
 * fix-page-transitions.js
 *
 * Two motion fixes, matching the HTML preview:
 *
 * 1. Page transitions: replaces the simple opacity fade with a
 *    directional clip-path wipe. The curtain sweeps in from the left,
 *    the route changes underneath while it's fully covering, then the
 *    same sweep continues out to the right. The destination page's name
 *    now appears centred in italic serif mid-sweep.
 *
 * 2. Scroll reveals: added the subtle scale-in from the preview
 *    (elements now settle from 0.98 to 1 as they fade up, not just a
 *    flat fade).
 *
 * The cursor was checked too. It already uses proper spring physics
 * (useSpring with stiffness/damping), which is actually more refined
 * than the preview, so that one was left alone.
 *
 * Run once from your project root:  node fix-page-transitions.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "components/transition.tsx": `"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import NextLink, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { curtainSeconds, easeCinematic, prefersReducedMotion } from "@/lib/motion";
import { site } from "@/lib/site";

type Phase = "idle" | "covering" | "covered" | "revealing";

const TransitionContext = createContext<(href: string) => void>(() => {});

export function useTransitionNavigate() {
  return useContext(TransitionContext);
}

function labelForPath(pathname: string) {
  if (pathname === "/") return "Home";
  if (pathname === "/gallery") return "Gallery";
  if (pathname.startsWith("/work")) return "Work";
  return site.nav.find((item) => item.href === pathname)?.label ?? "";
}

const CLIP_IDLE = "inset(0 100% 0 0)";
const CLIP_FULL = "inset(0 0 0 0)";
const CLIP_EXIT = "inset(0 0 0 100%)";

/**
 * A directional clip-path wipe between routes, sweeping left to right in
 * one continuous motion: the curtain sweeps in, the route changes
 * underneath while it's fully covering, then the same sweep continues out
 * the other side. The destination page's name appears centred mid-sweep.
 * Built on plain pathname watching rather than the still-experimental View
 * Transitions API, so it works the same in every browser. Falls back to an
 * instant navigation under prefers-reduced-motion.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      setPhase((current) => (current === "covered" ? "revealing" : current));
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const timeout = window.setTimeout(() => setPhase("idle"), curtainSeconds * 1000);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  function navigate(href: string) {
    if (href === pathname) return;
    if (prefersReducedMotion()) {
      router.push(href);
      return;
    }
    setLabel(labelForPath(href));
    setPhase("covering");
    window.setTimeout(() => {
      router.push(href);
      setPhase("covered");
      // Safety net: if the route change never lands (a broken href, a
      // route that errors), don't leave the visitor staring at ink forever.
      window.setTimeout(() => {
        setPhase((current) => (current === "covered" ? "idle" : current));
      }, 4000);
    }, curtainSeconds * 1000);
  }

  const clipPath = phase === "idle" ? CLIP_IDLE : phase === "revealing" ? CLIP_EXIT : CLIP_FULL;
  const labelVisible = phase === "covering" || phase === "covered";

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[70] flex items-center justify-center bg-ink"
        initial={false}
        animate={{ clipPath }}
        transition={{ duration: curtainSeconds, ease: easeCinematic }}
        style={{ pointerEvents: phase === "covering" || phase === "covered" ? "auto" : "none" }}
      >
        <motion.span
          className="font-serif text-h1 italic text-paper"
          initial={false}
          animate={{ opacity: labelVisible ? 1 : 0 }}
          transition={{ duration: 0.35, delay: phase === "covering" ? 0.22 : 0 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { children: ReactNode };

/** A next/link that routes through the curtain transition for plain internal navigations. */
export function TransitionLink({ href, children, onClick, target, ...rest }: TransitionLinkProps) {
  const navigate = useTransitionNavigate();
  const hrefString = typeof href === "string" ? href : (href.pathname ?? "");

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target && target !== "_self") return;
    if (/^([a-z]+:)|^#/.test(hrefString)) return; // external, mailto, tel, hash
    event.preventDefault();
    navigate(hrefString);
  }

  return (
    <NextLink href={href} onClick={handleClick} target={target} {...rest}>
      {children}
    </NextLink>
  );
}
`,
  "lib/motion.ts": `/**
 * Shared motion primitives. Keeping these in one place is what makes the
 * site's animation feel like one considered voice instead of a different
 * easing curve on every component.
 */

// Matches tailwind.config.ts \`transitionTimingFunction.cinematic\`.
export const easeCinematic = [0.65, 0, 0.15, 1] as const;
// Matches \`transitionTimingFunction.reveal\` — a softer settle, used for
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
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Your dev server should pick these up automatically.");
