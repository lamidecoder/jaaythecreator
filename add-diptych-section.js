#!/usr/bin/env node
/**
 * add-diptych-section.js
 *
 * Builds the "Selected moments." two-panel section from the preview
 * you showed me, as a new, real component (components/diptych.tsx),
 * wired into the homepage right after the existing grid.
 *
 * Panels are fixed-size (60vh mobile, 80vh desktop) and use
 * object-cover, so video stretches to fill completely, unlike the
 * grid above it which never crops. Captions fade in above the panels
 * on hover (desktop) or sit at the bottom of each panel (mobile).
 *
 * Also, while pulling your real repository directly to fix this
 * properly:
 * - Rose & Marble is back, using piece-16's video
 * - Emerald & Gold and The Ivory Hour now live only in this new
 *   Diptych section, not duplicated in the grid below
 * - piece-16 stepped back from the main grid since its video now
 *   lives under the Rose & Marble name
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node add-diptych-section.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "app/page.tsx": `import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { Showcase } from "@/components/showcase";
import { Diptych } from "@/components/diptych";
import { AboutTeaser } from "@/components/about-teaser";
import { ServicesSection } from "@/components/services-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Showcase />
      <Diptych />
      <AboutTeaser />
      <ServicesSection />
    </>
  );
}
`,
  "components/diptych.tsx": `"use client";

import { useState } from "react";
import { projects } from "@/lib/projects";
import { TransitionLink } from "./transition";
import { Reveal } from "./reveal";
import { videoMimeType } from "./media-frame";

/** The two slugs shown here are deliberately not part of the regular
 * Showcase grid (see projects.ts), so nothing is duplicated between
 * this section and the grid below it. */
const DIPTYCH_SLUGS = ["emerald-and-gold", "the-ivory-hour"];

export function Diptych() {
  const [hovered, setHovered] = useState<string | null>(null);
  const panels = DIPTYCH_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  if (panels.length === 0) return null;

  return (
    <section className="bg-ink px-6 pb-28 pt-8 sm:px-10 sm:pt-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl font-serif text-h1 text-paper">Selected moments.</h2>
            <TransitionLink
              href="/work"
              className="font-sans text-xs uppercase tracking-[0.2em] text-paper/60 transition-colors hover:text-paper"
            >
              View all work
            </TransitionLink>
          </div>
        </Reveal>

        {/* Caption strip: each side shows its panel's title/category on hover. */}
        <div className="mt-8 hidden grid-cols-2 gap-6 sm:grid">
          {panels.map((project) => (
            <div
              key={project.slug}
              className={\`transition-opacity duration-300 \${hovered === project.slug ? "opacity-100" : "opacity-0"}\`}
            >
              <p className="font-serif text-2xl italic text-paper">{project.title}</p>
              <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-paper/50">{project.category}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {panels.map((project) => (
            <TransitionLink
              key={project.slug}
              href={\`/work/\${project.slug}\`}
              className="group relative block h-[60vh] overflow-hidden bg-ink sm:h-[80vh]"
              onMouseEnter={() => setHovered(project.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              {project.hero.src ? (
                project.hero.type === "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]"
                  >
                    <source src={project.hero.src} type={videoMimeType(project.hero.src)} />
                  </video>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.hero.src}
                    alt={project.hero.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.03]"
                  />
                )
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-bone/30 to-ink" />
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-paper/40 font-sans text-[11px] uppercase tracking-[0.15em] text-paper backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  {project.hero.type === "video" ? "Watch" : "View"}
                </span>
              </div>

              {/* Caption also shown here for mobile, where the strip above is hidden. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-4 pt-10 sm:hidden">
                <p className="font-serif text-lg text-paper">{project.title}</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-[0.15em] text-paper/60">{project.category}</p>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  "lib/projects.ts": `export type Aspect = "16:9" | "9:16" | "4:5" | "4:3" | "3:4";

export type MediaAsset = {
  type: "video" | "image";
  aspect: Aspect;
  /**
   * Local path once a real file exists, e.g. "/media/work/emerald-and-gold/hero.mp4"
   * or ".../hero.jpg". Leave this out entirely and the site shows its editorial
   * placeholder treatment instead of a broken file, so the grid never looks
   * unfinished while real media is still being added. Run \`npm run media\`
   * after dropping files into media-inbox/ to fill these in automatically,
   * see organize-media.js for details.
   */
  src?: string;
  /** Poster frame shown before a video loads, and used if the video is ever unavailable. */
  poster?: string;
  alt: string;
  /** 1 to 8, picks which placeholder tone to render while src is empty. */
  placeholderTone: number;
};

export type Project = {
  slug: string;
  title: string;
  category: "Wedding" | "Bridal Prep" | "Asoebi Moments" | "Social Content";
  date: string;
  services: string[];
  excerpt: string;
  story: string[];
  hero: MediaAsset;
  /** Grid placement hint for the homepage showcase. */
  layout: "feature" | "wide" | "tall" | "square";
  gallery: MediaAsset[];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "rose-and-marble",
    title: "Rose & Marble",
    category: "Wedding",
    date: "2026-05-30",
    services: ["Wedding"],
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-16/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["REPLACE with the first story paragraph."],
  },

  {
    slug: "piece-10",
    title: "Piece 10", // REPLACE with the real title
    category: "Wedding", // REPLACE
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-10/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["REPLACE with the first story paragraph."],
  },

  {
    slug: "emerald-and-gold",
    title: "Emerald & Gold",
    category: "Bridal Prep",
    date: "2026-06-14",
    services: ["Bridal Prep"],
    excerpt: "A gele tied in under an hour, and every minute of it worth keeping.",
    featured: false,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-13/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "The pins go in one at a time, then the folding starts, then the small adjustments nobody but the stylist notices. Most of that never makes it into anyone's memory of the day.",
      "This one is about that hour: the part before anyone else arrives.",
    ],
  },

  {
    slug: "piece-11",
    title: "Piece 11", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "9:16",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-11/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-12",
    title: "Piece 12", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-12/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-13",
    title: "Piece 13", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: false,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-13/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-14",
    title: "Piece 14", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: false,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-14/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-8",
    title: "Piece 8", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-8/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-9",
    title: "Piece 9", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-9/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },
  {
    slug: "piece-1",
    title: "Piece 1", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-1/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-2",
    title: "Piece 2", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-2/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-3",
    title: "Piece 3", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-3/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-4",
    title: "Piece 4", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-4/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-5",
    title: "Piece 5", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-5/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-6",
    title: "Piece 6", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-6/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-7",
    title: "Piece 7", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-7/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-15",
    title: "Piece 15", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-15/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-16",
    title: "Piece 16", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: false,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-16/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-17",
    title: "Piece 17", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-17/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-18",
    title: "Piece 18", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-18/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-19",
    title: "Piece 19", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-19/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-20",
    title: "Piece 20", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-20/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "piece-21",
    title: "Piece 21", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-21/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },







{
  slug: "the-ivory-hour",
  title: "The Ivory Hour",
  category: "Wedding",
  date: "2026-04-25",
  services: ["Wedding"],
  excerpt: "REPLACE with a one-line summary.",
  featured: false,
  layout: "feature",
  hero: {
      type: "video",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-14/hero.mp4",
      placeholderTone: 1,
    },
  gallery: [],
  story: ["REPLACE with the first story paragraph."],
},
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string, count = 2) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return projects.slice(0, count);
  const rest = [...projects.slice(index + 1), ...projects.slice(0, index)];
  return rest.slice(0, count);
}

/**
 * Every photo across every project, pulled together automatically for the
 * Gallery page. Anything added to a project here (as its hero image or in
 * its gallery array) shows up on /gallery too, with no separate step.
 * Videos are left out, Gallery is specifically the photography set.
 */
const GALLERY_SIZES = ["large", "medium", "small", "medium"] as const;

export function getGalleryImages() {
  const images: (MediaAsset & { id: string; size: (typeof GALLERY_SIZES)[number] })[] = [];
  let count = 0;
  for (const project of projects) {
    const candidates = [project.hero, ...project.gallery];
    for (const media of candidates) {
      if (media.type !== "image") continue;
      images.push({ ...media, id: \`\${project.slug}-\${count}\`, size: GALLERY_SIZES[count % GALLERY_SIZES.length] });
      count++;
    }
  }
  return images;
}
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Restart your dev server to see the new Diptych section.");
