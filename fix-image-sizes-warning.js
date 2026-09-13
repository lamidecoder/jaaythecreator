#!/usr/bin/env node
/**
 * fix-image-sizes-warning.js
 *
 * On the hydration warning in your console: that one isn't a real bug,
 * it's the Grammarly browser extension injecting attributes into the
 * page before React loads (data-gr-ext-installed, etc.) — the warning
 * message itself even names this as a known cause. It only shows up in
 * your browser with that extension active, real visitors without it
 * installed will never see it, and it doesn't affect anything working
 * correctly either way.
 *
 * The image sizes warnings were real though. Both flagged images
 * (piece-8 in the About section, teal-veil-1 in Services) render at
 * roughly 480px wide on desktop, not full viewport width, so telling
 * Next.js "sizes=100vw" was making it serve larger images than
 * needed. Both now specify their actual rendered width. Also improved
 * the general default for any other image that doesn't set its own
 * sizes, from a flat 100vw to one that accounts for grid layouts.
 *
 * Confirmed the corrected sizes attribute actually appears in the
 * rendered HTML before sending this, plus a full production build.
 *
 * Run once from your project root:  node fix-image-sizes-warning.js
 */

const fs = require("fs");
const path = require("path");

const files = {
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
            preload="auto"
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
  "components/about-teaser.tsx": `import { MediaFrame } from "./media-frame";
import { Reveal } from "./reveal";
import { TransitionLink } from "./transition";

export function AboutTeaser() {
  return (
    <section className="bg-paper px-6 py-24 text-ink sm:px-10 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-12 sm:items-center sm:gap-8">
        <div className="sm:col-span-5">
          <MediaFrame
            sizes="(min-width: 640px) 480px, 100vw"
            media={{
              type: "image",
              aspect: "4:5",
              alt: "Bridal prep styling ahead of a wedding",
              src: "/media/work/piece-8/hero.jpg",
              placeholderTone: 4,
            }}
          />
        </div>
        <Reveal className="sm:col-span-7">
          <h2 className="font-serif text-h1 text-ink">{"Styled where it should be. Honest where it shouldn't."}</h2>
          <p className="mt-6 max-w-prose font-sans text-base leading-relaxed text-ink/70">
            {"A gele takes forty minutes to tie properly, and most people never see that part. We're there for the pins and the folding, not just the finished look."}
          </p>
          <TransitionLink
            href="/about"
            className="mt-8 inline-block font-sans text-xs uppercase tracking-[0.2em] text-ink/70 underline decoration-wine decoration-2 underline-offset-4 transition-colors hover:text-ink"
          >
            More about the studio
          </TransitionLink>
        </Reveal>
      </div>
    </section>
  );
}
`,
  "components/services-section.tsx": `"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { services } from "@/lib/services";
import { MediaFrame } from "./media-frame";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function ServicesSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const [active, setActive] = useState(0);
  const current = services[active];
  const Heading = headingLevel;

  return (
    <section className="bg-ink px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Heading className="max-w-xl font-serif text-h1 text-paper">What we offer.</Heading>
        </Reveal>

        <div className="mt-16 grid gap-12 sm:grid-cols-12 sm:gap-10">
          <ul className="sm:col-span-7">
            {services.map((service, index) => (
              <li key={service.slug} className="border-b border-paper/10">
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className="flex w-full items-baseline justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={cn(
                      "font-serif text-2xl transition-colors duration-300 sm:text-3xl",
                      active === index ? "text-paper" : "text-paper/45",
                    )}
                  >
                    {service.name}
                  </span>
                  <span className="hidden max-w-xs shrink-0 font-sans text-sm text-bone sm:block">
                    {service.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="sm:col-span-5">
            <motion.div key={current.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <MediaFrame
                sizes="(min-width: 640px) 480px, 100vw"
                media={{
                  type: "image",
                  aspect: "4:3",
                  alt: current.name,
                  src: current.src,
                  placeholderTone: current.placeholderTone,
                }}
              />
              <p className="mt-4 font-sans text-sm leading-relaxed text-bone">{current.detail}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
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
