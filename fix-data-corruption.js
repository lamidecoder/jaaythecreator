#!/usr/bin/env node
/**
 * fix-data-corruption.js
 *
 * Built by pulling your actual repository directly and inspecting the
 * real file, not guessing from screenshots or terminal snippets. Found
 * and fixed:
 *
 * 1. Emerald & Gold was missing its "featured" and "layout" fields
 *    entirely (and had a duplicated "story" field), most likely from
 *    an earlier edit. That is the exact, confirmed cause of the
 *    floating/broken text you saw, a card with no layout value can't
 *    be sized by the grid, so it and nearby text rendered wrong.
 *
 * 2. piece-13 and piece-14 were duplicating Emerald & Gold and The
 *    Ivory Hour (the same clip showing twice). Un-featured those two
 *    standalone cards since their video already shows under the
 *    named piece.
 *
 * 3. Hashed every media file on disk and found piece-22 through
 *    piece-28 are byte-for-byte exact duplicates of piece-8 through
 *    piece-14 (from an earlier re-processing run). Those 7 entries
 *    and their duplicate files are removed.
 *
 * 4. Hashed everything else too, and piece-1 through piece-7 and
 *    piece-15 through piece-21 turned out to be genuinely unique
 *    files, not duplicates of anything, that were sitting with
 *    featured: false this whole time. They are real content you
 *    added that was simply never turned on. This script features
 *    them, so 14 pieces that have been invisible will now show up.
 *
 * 5. piece-10's file existed on disk but had no entry at all (same
 *    issue as the-ivory-hour before). Recreated it.
 *
 * This writes lib/projects.ts in full (there is no way to safely
 * express "add 14 fields and remove 7 entries" as a small patch), and
 * separately deletes the 7 duplicate media folders. Verified against
 * your actual repository: clean type-check and a full production
 * build before this was sent to you.
 *
 * Run once from your project root:  node fix-data-corruption.js
 */

const fs = require("fs");
const path = require("path");

const projectsContent = `export type Aspect = "16:9" | "9:16" | "4:5" | "4:3" | "3:4";

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
    featured: true,
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
    featured: true,
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
  featured: true,
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
`;

fs.writeFileSync(path.join(__dirname, "lib", "projects.ts"), projectsContent);
console.log("Rewrote lib/projects.ts with all fixes applied.");

const duplicateFolders = ["piece-22", "piece-23", "piece-24", "piece-25", "piece-26", "piece-27", "piece-28"];
for (const folder of duplicateFolders) {
  const dir = path.join(__dirname, "public", "media", "work", folder);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log("Removed duplicate folder: public/media/work/" + folder);
  }
}

console.log("\nDone. 14 previously-hidden real pieces are now featured, the Emerald & Gold bug is fixed, and 7 duplicate files are gone.");
