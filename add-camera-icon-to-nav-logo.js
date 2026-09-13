#!/usr/bin/env node
/**
 * add-camera-icon-to-nav-logo.js
 *
 * Same camera icon from the preloader now sits beside the wordmark
 * in the actual site navigation too, so it shows on every page, not
 * just the loading screen.
 *
 * It uses currentColor for its stroke, so it automatically matches
 * whichever text color the logo already switches to, paper on dark
 * pages, ink on light pages like About, with no extra logic needed.
 * Confirmed both cases render with the correct color before sending
 * this.
 *
 * Run once from your project root:  node add-camera-icon-to-nav-logo.js
 */

const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "components", "navigation.tsx");

const content = `"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { TransitionLink } from "./transition";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 80));

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Pages whose content starts with a light (bg-paper) section instead of
  // the default dark background. The nav needs dark text there until it
  // picks up its own solid backdrop on scroll, otherwise light nav text
  // sits directly on the light page background and disappears.
  const lightStartPages = ["/about"];
  const onLightStart = lightStartPages.includes(pathname);
  const useDarkText = onLightStart && !scrolled && !menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 transition-colors duration-500 sm:px-10",
          scrolled || menuOpen ? "bg-ink/90 backdrop-blur-sm" : "bg-transparent",
        )}
      >
        <TransitionLink
          href="/"
          className={cn(
            "flex items-center gap-2 font-serif text-lg tracking-tight sm:text-xl",
            useDarkText ? "text-ink" : "text-paper",
          )}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
            <rect x="2" y="6" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M16 9.8L22 6.3V16.7L16 13.2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <circle cx="8.5" cy="11.5" r="2.6" stroke="currentColor" strokeWidth="1.3" />
            <rect x="4" y="4.3" width="3" height="1.7" rx="0.4" fill="currentColor" />
          </svg>
          {site.name}
        </TransitionLink>

        <nav className="hidden items-center gap-8 sm:flex">
          {site.nav.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className={cn(
                "font-sans text-xs uppercase tracking-[0.2em] transition-colors",
                pathname === item.href
                  ? useDarkText
                    ? "text-ink"
                    : "text-paper"
                  : useDarkText
                    ? "text-ink/55 hover:text-ink"
                    : "text-paper/55 hover:text-paper",
              )}
            >
              {item.label}
            </TransitionLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-[6px] sm:hidden"
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
            className={cn("h-px w-6", useDarkText ? "bg-ink" : "bg-paper")}
          />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className={cn("h-px w-6", useDarkText ? "bg-ink" : "bg-paper")} />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
            className={cn("h-px w-6", useDarkText ? "bg-ink" : "bg-paper")}
          />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-30 flex flex-col justify-center gap-5 bg-ink px-8 sm:hidden"
          >
            {site.nav.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.06, duration: 0.5 }}
              >
                <TransitionLink href={item.href} className="font-serif text-4xl text-paper">
                  {item.label}
                </TransitionLink>
              </motion.div>
            ))}
            <div className="mt-8 flex flex-col gap-2 font-sans text-sm text-bone">
              <a href={site.instagram.url} target="_blank" rel="noreferrer">
                {site.instagram.handle}
              </a>
              <a href={\`mailto:\${site.email}\`}>{site.email}</a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
`;

fs.writeFileSync(target, content);
console.log("Updated components/navigation.tsx — camera icon now part of the site logo.");
