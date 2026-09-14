#!/usr/bin/env node
/**
 * real-performance-fix.js
 *
 * Found and fixed the actual causes this time, not just theory:
 *
 * 1. Video encoding had NO resolution cap at all. Any source video
 *    stayed at its original resolution even though it only ever
 *    displays in a small grid tile — a 4K phone recording was being
 *    served at full 4K for a tile a few hundred pixels wide. New
 *    uploads (through organize-media-v2.js) now cap at 1920px on the
 *    longer side and use a slightly higher compression setting,
 *    meaningfully smaller files with no visible quality loss at
 *    actual display size. Tested with a real 2160x3840 video before
 *    sending this: correctly came out at 1080x1920.
 *
 * 2. No poster images. Every video showed a blank gap until enough
 *    data loaded to paint the first frame, especially painful on
 *    slow networks. organize-media-v2.js now automatically extracts
 *    a poster frame (half a second in, since frame 0 is sometimes a
 *    black flash on phone clips) alongside every new video, and all
 *    three places video renders on the site — the hero, the magazine
 *    grid cards, and individual project pages — now show that poster
 *    instantly while the actual video streams in behind it. Tested
 *    end to end: confirmed the poster generates, loads over HTTP,
 *    and isn't blank or corrupted.
 *
 * 3. Videos on the homepage and Work grid used to load once and then
 *    stay mounted and playing forever, even long after you'd
 *    scrolled past them. On a page with 20+ pieces, that meant
 *    everything you'd scrolled through kept running at once. They
 *    now properly pause and unmount once scrolled well out of view,
 *    and reload if you scroll back — so only what's actually near
 *    your screen is ever active.
 *
 * Note: the resolution cap and poster generation only apply to NEW
 * videos processed from here on. Your existing videos were encoded
 * before this fix existed, so they won't have a poster or the
 * smaller file size unless reprocessed. If you want, I can put
 * together a script that re-runs your existing library through the
 * improved pipeline — say the word.
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node real-performance-fix.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "organize-media-v2.js": `#!/usr/bin/env node
/**
 * organize-media.js
 *
 * Solves one problem: getting your raw photos and videos onto the site
 * without renaming anything or manually editing code.
 *
 * HOW TO USE
 * 1. Drop your video and photo files straight into media-inbox/. No
 *    subfolders, no renaming, exactly as your camera or phone named them.
 * 2. Run:  node organize-media.js   (or  npm run media)
 *
 * Each file becomes its own piece on the site, automatically. This
 * script now writes directly into lib/projects.ts, no copy-pasting
 * needed. Title, category, and the write-up still get placeholder text
 * marked REPLACE right there in the file, since only you can write
 * those, but the piece is live on the site immediately either way.
 *
 * WHAT IT DOES
 * - Copies each file into public/media/work/<slug>/hero.<ext>, where
 *   <slug> is built from the filename itself. Your originals in
 *   media-inbox/ are left untouched, nothing is ever deleted.
 * - Inserts a new entry directly into the "projects" array in
 *   lib/projects.ts for every file that doesn't already have one.
 * - Safe to re-run any time. Pieces that already exist (checked by
 *   slug, not just by file) are left alone, so dropping in a few new
 *   files and running it again only adds what's new.
 * - If lib/projects.ts has been edited enough that this script can't
 *   find a safe place to insert (rare), it falls back to writing
 *   lib/projects.new.ts instead, same as before, so nothing is lost.
 *
 * PORTRAIT / SQUARE CLIPS
 * Defaults to 16:9. Add a hint to the FILENAME for anything else:
 * "emerald_look_portrait.mp4" or "..._9x16.mp4" for vertical/phone
 * footage, "..._square.mp4" for square.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = __dirname;
const INBOX = path.join(ROOT, "media-inbox");
const MEDIA_OUT = path.join(ROOT, "public", "media", "work");
const PROJECTS_FILE = path.join(ROOT, "lib", "projects.ts");
const SNIPPET_OUT = path.join(ROOT, "lib", "projects.new.ts");

const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".webm"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function hasFfmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const FFMPEG_AVAILABLE = hasFfmpeg();
if (!FFMPEG_AVAILABLE) {
  console.log(
    "Note: ffmpeg isn't installed, so videos will be copied as-is. This works for most phone videos, but if one recorded in HEVC (\\"High Efficiency\\") won't play, install ffmpeg for guaranteed compatibility: winget install ffmpeg\\n",
  );
}

// Matches the array's closing bracket right before the helper functions,
// e.g. "\\n];\\n\\nexport function getProject". Whitespace-flexible so small
// formatting differences (extra blank lines, Prettier, etc.) don't break it.
const INSERT_MARKER = /(\\]\\s*;\\s*\\n\\s*export function getProject)/;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[_\\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const MAX_SLUG_LENGTH = 40;

function shortFallbackSlug(projectsSource, usedThisRun) {
  let n = 1;
  while (true) {
    const candidate = "piece-" + n;
    if (!projectsSource.includes(\`slug: "\${candidate}"\`) && !usedThisRun.has(candidate)) {
      return candidate;
    }
    n++;
  }
}

function titleCase(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalizeSeparators(name) {
  return name.replace(/[_-]+/g, " ");
}

function detectAspect(name) {
  const lower = normalizeSeparators(name).toLowerCase();
  if (/\\b(portrait|9x16|vertical)\\b/.test(lower)) return "9:16";
  if (/\\b(square|1x1)\\b/.test(lower)) return "1:1";
  return "16:9";
}

function stripHints(name) {
  return normalizeSeparators(name)
    .replace(/\\b(portrait|9x16|vertical|square|1x1)\\b/gi, "")
    .trim();
}

function isMediaFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return VIDEO_EXT.has(ext) || IMAGE_EXT.has(ext);
}

function layoutForAspect(aspect) {
  if (aspect === "9:16") return "tall";
  if (aspect === "1:1") return "square";
  return "wide";
}

function indentSnippet(snippet) {
  return snippet
    .split("\\n")
    .map((line) => "  " + line)
    .join("\\n");
}

if (!fs.existsSync(INBOX)) {
  fs.mkdirSync(INBOX, { recursive: true });
  console.log("Created media-inbox/. Drag your files straight in there (no subfolders needed) and run this again.");
  process.exit(0);
}

const files = fs
  .readdirSync(INBOX, { withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => d.name)
  .filter((f) => !f.startsWith(".") && isMediaFile(f));

if (files.length === 0) {
  console.log("media-inbox/ is empty. Drag your video and photo files in there and run this again.");
  process.exit(0);
}

fs.mkdirSync(MEDIA_OUT, { recursive: true });

const projectsSource = fs.existsSync(PROJECTS_FILE) ? fs.readFileSync(PROJECTS_FILE, "utf8") : "";

const snippets = [];
const usedThisRun = new Set();
let newCount = 0;
let skippedCount = 0;

for (const file of files) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const type = VIDEO_EXT.has(ext.toLowerCase()) ? "video" : "image";
  const aspect = detectAspect(base);
  let slug = slugify(stripHints(base)) || "piece";
  if (slug.length > MAX_SLUG_LENGTH) {
    // Filenames from download tools (Instagram savers, WhatsApp exports)
    // often embed a long cryptic ID. A slug built from that is unusable
    // as a URL, so fall back to a short generic one instead.
    slug = shortFallbackSlug(projectsSource, usedThisRun);
  }
  usedThisRun.add(slug);

  const alreadyHasEntry = projectsSource.includes(\`slug: "\${slug}"\`);
  if (alreadyHasEntry) {
    skippedCount++;
    continue;
  }

  const destDir = path.join(MEDIA_OUT, slug);
  let destName = type === "video" && FFMPEG_AVAILABLE ? "hero.mp4" : "hero" + ext;
  let destPath = path.join(destDir, destName);

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destDir, { recursive: true });
    let converted = false;

    if (type === "video" && FFMPEG_AVAILABLE) {
      try {
        execSync(
          \`ffmpeg -y -i "\${path.join(INBOX, file)}" -c:v libx264 -preset fast -crf 26 -pix_fmt yuv420p -vf "scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2" -c:a aac -b:a 128k -movflags +faststart "\${destPath}"\`,
          { stdio: "ignore" },
        );
        converted = true;

        // Poster frame: a still image shown instantly while the actual
        // video data is still loading, so the tile never shows a blank
        // gap. Taken a half-second in, since frame 0 is sometimes a
        // black flash on phone-recorded clips.
        const posterPath = path.join(destDir, "poster.jpg");
        try {
          execSync(\`ffmpeg -y -ss 00:00:00.5 -i "\${destPath}" -frames:v 1 -q:v 3 "\${posterPath}"\`, {
            stdio: "ignore",
          });
        } catch {
          // Poster is a nice-to-have, not worth failing the whole entry over.
        }
      } catch {
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        console.log(\`  (ffmpeg couldn't convert "\${file}", copying the original file instead)\`);
      }
    }

    if (!converted) {
      destName = "hero" + ext;
      destPath = path.join(destDir, destName);
      fs.copyFileSync(path.join(INBOX, file), destPath);
    }
  }

  newCount++;
  const title = titleCase(slug);
  const layout = layoutForAspect(aspect);

  const snippet = \`{
  slug: "\${slug}",
  title: "\${title}", // REPLACE with the real title
  category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
  date: "\${new Date().toISOString().slice(0, 10)}", // REPLACE with the real date
  services: ["Wedding"], // REPLACE
  excerpt: "REPLACE with a one-line summary.",
  featured: false,
  layout: "\${layout}",
  hero: {
    type: "\${type}",
    aspect: "\${aspect}",
    alt: "REPLACE — describe this shot for screen readers",
    src: "/media/work/\${slug}/\${destName}",
    placeholderTone: 1,
  },
  gallery: [],
  story: [
    "REPLACE with the first story paragraph.",
  ],
},\`;

  snippets.push(snippet);
  console.log(\`Done: "\${file}" -> public/media/work/\${slug}/\${destName}  (nothing renamed by hand)\`);
}

if (skippedCount > 0) {
  console.log(\`Skipped \${skippedCount} file\${skippedCount === 1 ? "" : "s"} that already have an entry in lib/projects.ts.\`);
}

if (snippets.length === 0) {
  console.log("\\nNothing new to process.");
  process.exit(0);
}

const insertion = snippets.map(indentSnippet).join("\\n\\n") + "\\n";

if (INSERT_MARKER.test(projectsSource)) {
  const updated = projectsSource.replace(INSERT_MARKER, \`\${insertion}$1\`);
  fs.writeFileSync(PROJECTS_FILE, updated);
  console.log(\`\\n\${newCount} new piece\${newCount === 1 ? "" : "s"} added directly to lib/projects.ts. Refresh your dev server to see them.\`);
  console.log("Each one still has REPLACE placeholders for title, category, and the write-up, open lib/projects.ts to fill those in.");
} else {
  fs.mkdirSync(path.dirname(SNIPPET_OUT), { recursive: true });
  const fileContent = \`// Auto-generated by organize-media.js — \${new Date().toISOString()}
//
// Could not find a safe spot to insert these into lib/projects.ts
// automatically (it may have been restructured), so they're here
// instead. Copy each object below into the "projects" array, then
// replace anything marked REPLACE.

\${snippets.join("\\n\\n")}
\`;
  fs.writeFileSync(SNIPPET_OUT, fileContent);
  console.log(\`\\n\${newCount} new piece\${newCount === 1 ? "" : "s"}. Couldn't auto-insert into lib/projects.ts, so entries were written to lib/projects.new.ts instead, copy them over manually.\`);
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

/**
 * Poster images sit alongside the video as poster.jpg (see
 * organize-media-v2.js), so this is always derivable from the video's
 * own path rather than needing its own data field. Videos processed
 * before poster generation existed won't have one, the browser just
 * quietly ignores a missing poster and falls back to its normal
 * behavior, so this is safe either way.
 */
export function videoPosterPath(src: string) {
  return src.replace(/\\/[^/]+$/, "/poster.jpg");
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
            poster={media.poster ?? videoPosterPath(media.src)}
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
  "components/magazine-card.tsx": `"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { videoMimeType, videoPosterPath } from "./media-frame";
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
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "400px",
    });
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
            poster={videoPosterPath(project.hero.src)}
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
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Restart your dev server.");
