export type Aspect = "16:9" | "9:16" | "4:5" | "4:3" | "3:4";

export type MediaAsset = {
  type: "video" | "image";
  aspect: Aspect;
  /**
   * Local path once a real file exists, e.g. "/media/work/emerald-and-gold/hero.mp4"
   * or ".../hero.jpg". Leave this out entirely and the site shows its editorial
   * placeholder treatment instead of a broken file, so the grid never looks
   * unfinished while real media is still being added. Run `npm run media`
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
    slug: "teal-veil-1",
    title: "Seafoam and Silk",
    category: "Wedding",
    date: "2026-09-13",
    services: ["Wedding"],
    excerpt: "A veil catching the wind above the city, seafoam silk against glass and steel.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "3:4",
      alt: "A veil catching the wind above the city, seafoam silk against glass and steel.",
      src: "/media/work/teal-veil-1/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["A veil catching the wind above the city, seafoam silk against glass and steel."],
  },

  {
    slug: "teal-veil-2",
    title: "Held Still",
    category: "Wedding",
    date: "2026-09-13",
    services: ["Wedding"],
    excerpt: "A quieter frame from the same seafoam moment, hands settled, eyes elsewhere.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "3:4",
      alt: "A quieter frame from the same seafoam moment, hands settled, eyes elsewhere.",
      src: "/media/work/teal-veil-2/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["A quieter frame from the same seafoam moment, hands settled, eyes elsewhere."],
  },

  {
    slug: "plum-iyawo",
    title: "Iyawo in Plum",
    category: "Wedding",
    date: "2026-09-13",
    services: ["Wedding"],
    excerpt: "Deep plum beading and a hand-painted fan, the bride's name stitched into the reveal.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "3:4",
      alt: "Deep plum beading and a hand-painted fan, the bride's name stitched into the reveal.",
      src: "/media/work/plum-iyawo/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["Deep plum beading and a hand-painted fan, the bride's name stitched into the reveal."],
  },

  {
    slug: "silver-gele-1",
    title: "Holographic Hour",
    category: "Wedding",
    date: "2026-09-13",
    services: ["Wedding"],
    excerpt: "Silver gele catching every light in the room, profile turned toward the glow.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "3:4",
      alt: "Silver gele catching every light in the room, profile turned toward the glow.",
      src: "/media/work/silver-gele-1/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["Silver gele catching every light in the room, profile turned toward the glow."],
  },

  {
    slug: "silver-gele-2",
    title: "Ice and Diamonds",
    category: "Wedding",
    date: "2026-09-13",
    services: ["Wedding"],
    excerpt: "The same silver hour, faced forward, ice-blue beading meeting the camera.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "3:4",
      alt: "The same silver hour, faced forward, ice-blue beading meeting the camera.",
      src: "/media/work/silver-gele-2/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["The same silver hour, faced forward, ice-blue beading meeting the camera."],
  },

  {
    slug: "mint-maroon-1",
    title: "Peacocks and Pearls",
    category: "Asoebi Moments",
    date: "2026-09-13",
    services: ["Asoebi Moments"],
    excerpt: "A hand-painted fan and a mint-and-maroon aso-ebi, caught mid-laugh.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "3:4",
      alt: "A hand-painted fan and a mint-and-maroon aso-ebi, caught mid-laugh.",
      src: "/media/work/mint-maroon-1/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["A hand-painted fan and a mint-and-maroon aso-ebi, caught mid-laugh."],
  },

  {
    slug: "mint-maroon-2",
    title: "The Reveal",
    category: "Asoebi Moments",
    date: "2026-09-13",
    services: ["Asoebi Moments"],
    excerpt: "Same aso-ebi, a different room, a gift extended across a reception table.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "3:4",
      alt: "Same aso-ebi, a different room, a gift extended across a reception table.",
      src: "/media/work/mint-maroon-2/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["Same aso-ebi, a different room, a gift extended across a reception table."],
  },

  {
    slug: "mint-maroon-3",
    title: "Garden Wall",
    category: "Asoebi Moments",
    date: "2026-09-13",
    services: ["Asoebi Moments"],
    excerpt: "The mint-and-maroon pattern framed against brick and green, close and unhurried.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "3:4",
      alt: "The mint-and-maroon pattern framed against brick and green, close and unhurried.",
      src: "/media/work/mint-maroon-3/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: ["The mint-and-maroon pattern framed against brick and green, close and unhurried."],
  },

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
    title: "The Quiet Frame",
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
    title: "Coral and Company",
    category: "Asoebi Moments", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Asoebi Moments"], // REPLACE
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
    title: "The Matching Hour",
    category: "Asoebi Moments", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Asoebi Moments"], // REPLACE
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
    title: "Where the Light Falls",
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
    title: "Ivory and Lace",
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
    title: "Details Before Dark",
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
    title: "Threaded in Gold",
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
    title: "The First Look",
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
    title: "Pins and Patience",
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
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
    title: "The Final Fitting",
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
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
    title: "Mirror Moments",
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
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
    title: "Golden Hour Vows",
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
    title: "Behind the Scenes",
    category: "Social Content", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Social Content"], // REPLACE
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
    title: "The Long Walk",
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
    title: "The Toast",
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
    title: "Powder and Silk",
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
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
    title: "The Quiet Before",
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
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
    title: "Last Dance",
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
    title: "Laced and Ready",
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
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
    title: "Veil in Hand",
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
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
    title: "The Last Touch",
    category: "Bridal Prep", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"], // REPLACE
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
      images.push({ ...media, id: `${project.slug}-${count}`, size: GALLERY_SIZES[count % GALLERY_SIZES.length] });
      count++;
    }
  }
  return images;
}
