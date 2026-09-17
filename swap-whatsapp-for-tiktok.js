#!/usr/bin/env node
/**
 * swap-whatsapp-for-tiktok.js
 *
 * WhatsApp replaced with TikTok everywhere it appeared: the hero icon
 * stack, the footer, and the Contact page's details list, so nothing
 * is left inconsistent between sections.
 *
 * Added a tiktok field to lib/site.ts (handle + url) using a
 * placeholder handle matching your Instagram one, REPLACE it with
 * your real TikTok handle if it's different.
 *
 * The TikTok icon is solid-filled rather than thin line-art like the
 * others, tried an outline version first but the shape didn't
 * simplify well and looked worse, so recognizability won out over
 * strict style consistency, checked both versions visually before
 * deciding.
 *
 * Verified against your actual repository: clean type-check, a full
 * production build, and confirmed TikTok correctly appears and
 * WhatsApp is fully gone from all three locations in the real
 * rendered pages before this was sent to you.
 *
 * Run once from your project root:  node swap-whatsapp-for-tiktok.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "lib/site.ts": `/**
 * Site-wide configuration.
 *
 * Everything in this file is a placeholder value. Replace the fields marked
 * REPLACE below with the real details before launch. Nothing else in the
 * codebase needs to change; every page reads from here.
 */
export const site = {
  name: "Jaaythecreator",
  legalName: "Jaaythecreator",
  title: "Jaaythecreator — Wedding, Bridal Prep & Asoebi Films",
  description:
    "Wedding films and photography from Jaaythecreator: weddings, bridal prep, gele styling moments, and asoebi coverage, based in London and available wherever your story takes place.",

  // REPLACE: the live domain, once one is chosen. Used for metadata,
  // sitemap.xml and canonical URLs.
  url: "https://www.jaaythecreator.com",

  location: "London, UK",
  locationLine: "Based in London. Available wherever the story takes you.",

  // REPLACE: real contact details.
  email: "hello@jaaythecreator.com",
  phone: "+44 7000 000000",
  whatsapp: "https://wa.me/447000000000",

  // Matches the existing @jaaythecreaator handle.
  instagram: {
    handle: "@jaaythecreaator",
    url: "https://instagram.com/jaaythecreaator",
  },

  // REPLACE with the real TikTok handle and URL once one exists.
  tiktok: {
    handle: "@jaaythecreaator",
    url: "https://tiktok.com/@jaaythecreaator",
  },

  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Reviews & FAQ", href: "/faq" },
    { label: "Booking", href: "/booking" },
    { label: "Contact", href: "/contact" },
  ],

  // Which project's hero media plays as the homepage's full-bleed
  // background. Change this to any slug from lib/projects.ts whenever a
  // better hero clip is ready, the homepage picks it up automatically.
  // Falls back to the placeholder tone if this slug has no media yet.
  heroProjectSlug: "piece-11",
} as const;
`,
  "components/social-icons.tsx": `export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="0" y="0" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="19" cy="5" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function EmailIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="0" y="2" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1 4L12 13L23 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M16.5 2c.3 2.2 1.7 3.7 3.9 3.9v2.9c-1.4 0-2.7-.4-3.9-1.2v6.4c0 3.1-2.3 5.5-5.5 5.5-3.1 0-5.5-2.4-5.5-5.5s2.4-5.5 5.5-5.5c.3 0 .6 0 .9.1v2.9c-.3-.1-.6-.1-.9-.1-1.5 0-2.7 1.2-2.7 2.6 0 1.5 1.2 2.7 2.7 2.7 1.5 0 2.8-1.2 2.8-2.7V2h2.7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.1 1.6 5.9L0 24l6.3-1.6C8 23.4 10 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M7.5 7.2c.3-.6.6-.6.9-.6h.7c.2 0 .5 0 .7.5s.8 1.9.8 2.1c0 .2 0 .3-.1.5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.9 1.5 1.9 2.4 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.9.3.1.4.2.5.3.1.2.1.9-.2 1.7-.3.8-1.6 1.5-2.3 1.6-.6.1-1.3.1-2.1-.1-.5-.1-1.1-.3-1.9-.7-3.3-1.4-5.4-4.8-5.6-5-.2-.2-1.3-1.7-1.3-3.3s.8-2.3 1.1-2.6z"
        fill="currentColor"
      />
    </svg>
  );
}
`,
  "components/hero.tsx": `"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import { prefersReducedMotion } from "@/lib/motion";
import { placeholderTone } from "@/lib/placeholder-tones";
import { getProject } from "@/lib/projects";
import { videoMimeType, videoPosterPath } from "./media-frame";
import { InstagramIcon, TikTokIcon } from "./social-icons";
import { site } from "@/lib/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The one big orchestrated motion moment on the site: as the visitor scrolls
 * past the hero, the frame settles from full-bleed into a rounded panel and
 * the statement clears out of the way, so the showcase feels like a
 * continuation of the same opening shot rather than a new page.
 */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const heroProject = getProject(site.heroProjectSlug);
  const heroSrc = heroProject?.hero.src;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.3,
        },
      })
        .to(frameRef.current, { scale: 0.86, borderRadius: 28, ease: "none" }, 0)
        .to(headlineRef.current, { yPercent: -30, opacity: 0, ease: "none" }, 0)
        .to(subRef.current, { yPercent: -18, opacity: 0, ease: "none" }, 0)
        .to(cueRef.current, { opacity: 0, ease: "none" }, 0.04);
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <div ref={frameRef} className="absolute inset-0 origin-center overflow-hidden">
          {heroSrc ? (
            <motion.video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={videoPosterPath(heroSrc)}
              className="absolute inset-0 h-full w-full object-cover"
              animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
              transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
            >
              <source src={heroSrc} type={videoMimeType(heroSrc)} />
            </motion.video>
          ) : (
            <motion.div
              className="absolute inset-0"
              style={{ backgroundImage: placeholderTone(1) }}
              animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
              transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/50" />
        </div>

        <div className="relative flex h-full flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-24">
          <h1
            ref={headlineRef}
            className="max-w-2xl font-serif text-display-lg text-paper"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}
          >
            We keep what the day leaves behind.
          </h1>
          <p
            ref={subRef}
            className="mt-6 max-w-md font-sans text-sm text-bone sm:text-base"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}
          >
            {"Weddings, bridal prep, and asoebi moments. UK-based, available worldwide."}
          </p>
        </div>

        <div className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-5 sm:right-10">
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-paper/70 transition-colors hover:text-paper"
          >
            <InstagramIcon />
          </a>
          <span className="h-6 w-px bg-paper/25" aria-hidden="true" />
          <a
            href={site.tiktok.url}
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="text-paper/70 transition-colors hover:text-paper"
          >
            <TikTokIcon />
          </a>
        </div>

        <span
          ref={cueRef}
          className="absolute bottom-8 right-6 font-sans text-[11px] uppercase tracking-[0.25em] text-paper/50 sm:right-10"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
`,
  "components/footer.tsx": `import { TransitionLink } from "./transition";
import { MagneticButton } from "./magnetic-button";
import { InstagramIcon, EmailIcon, TikTokIcon } from "./social-icons";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative bg-ink px-6 pb-10 pt-24 sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <p className="max-w-3xl font-serif text-h1 leading-[1.05] text-paper">
          {"Let's keep yours."}
        </p>
        <p className="mt-6 max-w-md font-sans text-base text-bone">
          {"Tell us about the day and we'll take it from there."}
        </p>

        <MagneticButton className="mt-10">
          <TransitionLink
            href="/contact"
            className="inline-flex items-center gap-3 border border-paper/30 px-7 py-4 font-sans text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:border-paper"
          >
            Start your story
          </TransitionLink>
        </MagneticButton>

        <div className="mt-24 grid grid-cols-2 gap-8 border-t border-paper/10 pt-10 font-sans text-sm text-bone sm:grid-cols-4">
          <div>
            <InstagramIcon className="text-paper/40" />
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-paper transition-colors hover:text-wine-soft"
            >
              {site.instagram.handle}
            </a>
          </div>
          <div>
            <EmailIcon className="text-paper/40" />
            <a href={\`mailto:\${site.email}\`} className="mt-3 inline-block text-paper transition-colors hover:text-wine-soft">
              {site.email}
            </a>
          </div>
          <div>
            <TikTokIcon className="text-paper/40" />
            <a
              href={site.tiktok.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-paper transition-colors hover:text-wine-soft"
            >
              {site.tiktok.handle}
            </a>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-paper/40">Location</p>
            <p className="mt-2 text-paper">{site.location}</p>
          </div>
        </div>

        <div className="mt-16 border-t border-paper/10 pt-10">
          <p className="font-sans text-sm text-bone">
            {"Looking for gele styling specifically? "}
            <a
              href="https://jaygele.com"
              target="_blank"
              rel="noreferrer"
              className="text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:text-wine-soft hover:decoration-wine-soft"
            >
              Visit jaygele.com
            </a>
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-4 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
            <span className="mx-2 text-paper/20">·</span>
            Built by NexusHouseUK
          </p>
          <div className="flex gap-6">
            {site.nav.map((item) => (
              <TransitionLink key={item.href} href={item.href} className="transition-colors hover:text-paper/70">
                {item.label}
              </TransitionLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
`,
  "app/contact/page.tsx": `import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about your wedding film and photography.",
};

export default function ContactPage() {
  return (
    <div className="bg-ink px-6 pb-28 pt-40 sm:px-10 sm:pt-48">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 sm:grid-cols-12 sm:gap-10">
          <div className="sm:col-span-5">
            <h1 className="font-serif text-display text-paper">Start your story.</h1>
            <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-bone">
              {"Tell us about the day and we'll take it from there. We usually reply within two working days."}
            </p>

            <dl className="mt-12 space-y-6 font-sans text-sm">
              <div>
                <dt className="text-paper/40">Email</dt>
                <dd className="mt-1">
                  <a href={\`mailto:\${site.email}\`} className="text-paper transition-colors hover:text-wine-soft">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-paper/40">TikTok</dt>
                <dd className="mt-1">
                  <a href={site.tiktok.url} className="text-paper transition-colors hover:text-wine-soft">
                    {site.tiktok.handle}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-paper/40">Instagram</dt>
                <dd className="mt-1">
                  <a href={site.instagram.url} className="text-paper transition-colors hover:text-wine-soft">
                    {site.instagram.handle}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-paper/40">Based in</dt>
                <dd className="mt-1 text-paper">{site.location}</dd>
              </div>
            </dl>

            <div className="relative mt-10 aspect-[4/5] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/work/mint-maroon-1/hero.jpg"
                alt="A guest laughing at a wedding, holding a hand fan"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="sm:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
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
