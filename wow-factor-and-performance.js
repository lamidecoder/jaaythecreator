#!/usr/bin/env node
/**
 * wow-factor-and-performance.js
 *
 * 1. Video cards on the homepage and Work page are no longer
 *    clickable — removed the link and the Watch/View button
 *    entirely. They're purely visual now.
 *
 * 2. Real lazy-loading added: videos on those cards now only load
 *    and start playing once they actually scroll near the viewport
 *    (with a 400px buffer so it's ready just before you reach it),
 *    instead of every video on the page loading and playing at
 *    once. This is very likely the main cause of the lag — a page
 *    with 20+ autoplaying videos loading simultaneously will always
 *    feel slow, regardless of the videos themselves. Also reduced
 *    preload from "auto" to "metadata" everywhere else.
 *
 * 3. Scroll staggering fixed at the actual source: the 1.6s smooth-
 *    scroll duration from before was overcorrected, so it's back
 *    down to 1.2s with a gentler ease. More importantly, the hero's
 *    pin animation had its own separate 0.6s catch-up delay on top
 *    of Lenis's smoothing — two layers of lag stacking on each
 *    other. That's now 0.3s, which should feel direct rather than
 *    sluggish specifically where the hero hands off to the next
 *    section.
 *
 * 4. Added a real photo to both the Contact page (in the left
 *    column) and the Booking page (as a banner above the process
 *    steps), so neither reads as a bare form anymore.
 *
 * 5. Preloader enhanced: a real visual progress bar (not just the
 *    number), a livelier entrance for the site name, and the exit
 *    is now a curtain-style wipe matching the same page-transition
 *    style used elsewhere on the site, instead of a plain fade.
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node wow-factor-and-performance.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "components/magazine-card.tsx": `"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { videoMimeType } from "./media-frame";
import { cn } from "@/lib/utils";

export function MagazineCard({
  project,
  span,
  sizeClass,
  objectPosition,
}: {
  project: Project;
  span: string;
  sizeClass: string;
  objectPosition?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("group relative overflow-hidden bg-ink", sizeClass, span)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {project.hero.src && inView ? (
        project.hero.type === "video" ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]",
              objectPosition,
            )}
          >
            <source src={project.hero.src} type={videoMimeType(project.hero.src)} />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.hero.src}
            alt={project.hero.alt}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]",
              objectPosition,
            )}
          />
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bone/30 to-ink" />
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 sm:opacity-0",
          hovered ? "sm:opacity-100" : "",
        )}
      >
        <p className="font-serif text-lg text-paper sm:text-xl">{project.title}</p>
        <p className="mt-1 font-sans text-xs uppercase tracking-[0.15em] text-paper/60">{project.category}</p>
      </div>
    </div>
  );
}
`,
  "components/media-frame.tsx": `"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/lib/projects";
import { placeholderTone } from "@/lib/placeholder-tones";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function videoMimeType(src: string) {
  const ext = src.split(".").pop()?.toLowerCase();
  if (ext === "mov") return "video/quicktime";
  if (ext === "webm") return "video/webm";
  if (ext === "m4v") return "video/x-m4v";
  return "video/mp4";
}

type MediaFrameProps = {
  media: MediaAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Shown only in placeholder mode, in a quiet corner. Omit for a clean, textless frame. */
  caption?: string;
  /**
   * "cover" (default) locks the wrapper to the media's own declared aspect
   * ratio, used everywhere in the exhibition grids so tiles line up in a
   * predictable grid. "contain" instead fills whatever box the parent
   * gives it, used by the lightbox and the project-detail hero, where the
   * box size is fixed by the layout itself.
   *
   * Neither mode crops the actual media: both use object-contain, so the
   * full frame is always visible. "cover" only affects how the
   * surrounding box gets its size, not how the media fits inside it.
   */
  fit?: "cover" | "contain";
};

/**
 * Renders one piece of media at its own natural aspect ratio. A 9:16 film
 * stays 9:16, a 4:3 photograph stays 4:3 — nothing here forces a crop to
 * 16:9. When a project has no \`src\` yet, it falls back to one of the
 * studio's placeholder tones instead of a broken file or a stock photo.
 *
 * Video plays via plain native autoplay (autoPlay + muted + playsInline),
 * which every browser handles on its own with no JavaScript required.
 * An earlier version gated playback behind an IntersectionObserver and a
 * manual .play() call to pause off-screen video for performance, that's
 * gone for now in favour of the simpler, more reliable version, it can be
 * reintroduced later once real footage is in and performance tuning
 * actually matters.
 */
export function MediaFrame({
  media,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  caption,
  fit = "cover",
}: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Safety net only: if the visitor has reduced motion turned on, stop
    // the video right after it mounts rather than fighting the browser
    // to never start it in the first place.
    if (prefersReducedMotion()) {
      videoRef.current?.pause();
    }
  }, []);

  const [w, h] = media.aspect.split(":").map(Number);

  return (
    <div
      className={cn("relative overflow-hidden bg-ink", fit === "cover" ? "max-h-[75vh]" : "", className)}
      style={fit === "cover" ? { aspectRatio: \`\${w} / \${h}\` } : undefined}
    >
      {media.src ? (
        media.type === "video" ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.poster}
            aria-label={media.alt}
            className="absolute inset-0 h-full w-full object-contain"
          >
            <source src={media.src} type={videoMimeType(media.src)} />
          </video>
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain"
          />
        )
      ) : (
        <div
          className="absolute inset-0 flex items-end p-4"
          style={{ backgroundImage: placeholderTone(media.placeholderTone) }}
          role="img"
          aria-label={media.alt}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 90px rgba(0,0,0,0.35)" }}
          />
          {caption ? (
            <span className="relative font-sans text-[11px] tracking-wide text-paper/40">
              {caption}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
`,
  "components/smooth-scroll.tsx": `"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
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

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
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
import { videoMimeType } from "./media-frame";
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
                <dt className="text-paper/40">WhatsApp</dt>
                <dd className="mt-1">
                  <a href={site.whatsapp} className="text-paper transition-colors hover:text-wine-soft">
                    {site.phone}
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
  "components/booking-section.tsx": `"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { services } from "@/lib/services";

const steps = [
  { title: "Enquire", detail: "Send over the date, the service you're after, and a little about what you're picturing." },
  { title: "We confirm availability", detail: "A reply within two working days confirming the date is open, with pricing for what you've described." },
  { title: "A deposit secures the date", detail: "Once the deposit is in, the date is held. Everything else gets worked out closer to the day." },
];

const budgets = ["Under £500", "£500 – £1,500", "£1,500 – £4,000", "£4,000+", "Not sure yet"];

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full border-0 border-b border-paper/25 bg-transparent py-2 font-sans text-base text-paper placeholder:text-paper/30 focus:border-paper focus:outline-none";

export function BookingSection() {
  const [service, setService] = useState(services[0].name);
  const [budget, setBudget] = useState(budgets[0]);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, service, budget }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
      setBudget(budgets[0]);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-ink">
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-40 sm:px-10 sm:pt-48">
        <h1 className="font-serif text-display text-paper">Book your session.</h1>
        <p className="mt-6 max-w-md font-sans text-base text-bone">
          {"Tell us which service you're after and the date you're picturing, and we'll take it from there."}
        </p>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/work/silver-gele-2/hero.jpg"
            alt="A guest in silver and ice-blue at a wedding"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 20%" }}
          />
        </div>

        <div className="mt-16 grid gap-8 border-y border-paper/10 py-12 sm:grid-cols-3 sm:gap-10">
          {steps.map((step, index) => (
            <div key={step.title}>
              <p className="font-serif text-2xl text-wine-soft">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-3 font-sans text-sm uppercase tracking-[0.15em] text-paper">{step.title}</p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-bone">{step.detail}</p>
            </div>
          ))}
        </div>

        {status === "success" ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-16 max-w-lg">
            <p className="font-serif text-h2 text-paper">Thank you.</p>
            <p className="mt-4 font-sans text-base leading-relaxed text-bone">
              {"Your booking enquiry is in. We'll confirm availability and next steps within two working days."}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-16 max-w-2xl">
            <fieldset>
              <legend className="font-sans text-sm text-paper/60">Which service?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {services.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setService(item.name)}
                    className={cn(
                      "border px-4 py-2 font-sans text-sm transition-colors",
                      service === item.name ? "border-paper bg-paper text-ink" : "border-paper/25 text-paper/70 hover:border-paper/60",
                    )}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <Field label="Name" htmlFor="b-name">
                <input id="b-name" name="name" type="text" required className={inputClass} />
              </Field>
              <Field label="Email" htmlFor="b-email">
                <input id="b-email" name="email" type="email" required className={inputClass} />
              </Field>
              <Field label="Phone (optional)" htmlFor="b-phone">
                <input id="b-phone" name="phone" type="tel" className={inputClass} />
              </Field>
              <Field label="Preferred date" htmlFor="b-date">
                <input id="b-date" name="date" type="date" className={inputClass} />
              </Field>
              <Field label="Location" htmlFor="b-location" className="sm:col-span-2">
                <input id="b-location" name="location" type="text" placeholder="Venue, city, or region" className={inputClass} />
              </Field>
            </div>

            <fieldset className="mt-8">
              <legend className="font-sans text-sm text-paper/60">Budget</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {budgets.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setBudget(range)}
                    className={cn(
                      "border px-4 py-2 font-sans text-sm transition-colors",
                      budget === range ? "border-paper bg-paper text-ink" : "border-paper/25 text-paper/70 hover:border-paper/60",
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </fieldset>

            <Field label="Anything else worth knowing?" htmlFor="b-message" className="mt-8">
              <textarea
                id="b-message"
                name="message"
                rows={4}
                placeholder="The people involved, the vibe you're after, anything that helps us plan."
                className={cn(inputClass, "resize-none")}
              />
            </Field>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-10 border border-paper px-8 py-4 font-sans text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-paper hover:text-ink disabled:opacity-50"
            >
              {status === "submitting" ? "Sending…" : "Request this date"}
            </button>

            {status === "error" ? (
              <p className="mt-4 font-sans text-sm text-wine-soft">
                {"Something went wrong sending that. Please try again, or email us directly."}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, htmlFor, children, className }: { label: string; htmlFor: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="font-sans text-sm text-paper/60">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
`,
  "components/intro-loader.tsx": `"use client";

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
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Restart your dev server.");
