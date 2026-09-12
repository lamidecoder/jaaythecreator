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
    slug: "emerald-and-gold",
    title: "Emerald & Gold",
    category: "Bridal Prep",
    date: "2026-06-14",
    services: ["Bridal Prep"],
    excerpt: "A gele tied in under an hour, and every minute of it worth keeping.",
    story: [
      "The pins go in one at a time, then the folding starts, then the small adjustments nobody but the stylist notices. Most of that never makes it into anyone's memory of the day.",
      "This one is about that hour: the part before anyone else arrives.",
    ],
    hero: { type: "video", aspect: "4:5", alt: "Gele styling in emerald and gold", placeholderTone: 1 },
    layout: "tall",
    gallery: [
      { type: "image", aspect: "4:5", alt: "Detail of the gele fold", placeholderTone: 2 },
      { type: "image", aspect: "4:5", alt: "The finished look, emerald and gold", placeholderTone: 4 },
    ],
    featured: true,
  },
  {
    slug: "the-ivory-hour",
    title: "The Ivory Hour",
    category: "Wedding",
    date: "2026-04-25",
    services: ["Wedding"],
    excerpt: "Full day coverage, from the first look through to the last song.",
    story: [
      "A quiet morning that built into a very loud evening. The film and the gallery both move the same way: slow at the start, faster by the end.",
    ],
    hero: { type: "image", aspect: "4:5", alt: "A bride in an ivory gown ahead of her ceremony", placeholderTone: 4 },
    layout: "feature",
    gallery: [
      { type: "image", aspect: "4:5", alt: "Getting ready ahead of the ceremony", placeholderTone: 6 },
      { type: "image", aspect: "16:9", alt: "The ceremony itself", placeholderTone: 3 },
    ],
    featured: true,
  },
  {
    slug: "lilac-at-dusk",
    title: "Lilac at Dusk",
    category: "Asoebi Moments",
    date: "2026-08-02",
    services: ["Asoebi Moments"],
    excerpt: "The coordinated family look, given its own five minutes before the reception.",
    story: [
      "Everyone matching, everyone glad to be asked to stand still for a moment before the noise starts. This is the set of photographs people actually ask for copies of.",
    ],
    hero: { type: "image", aspect: "9:16", alt: "A coordinated asoebi group in lilac", placeholderTone: 8 },
    layout: "tall",
    gallery: [],
    featured: false,
  },
  {
    slug: "mint-quiet-light",
    title: "Mint, Quiet Light",
    category: "Bridal Prep",
    date: "2025-10-04",
    services: ["Bridal Prep"],
    excerpt: "An afternoon session, styled and shot in low, even light.",
    story: [
      "No ceremony attached to this one, just a styled portrait session built around a single look. Sometimes the outfit is the whole story.",
    ],
    hero: { type: "video", aspect: "4:5", alt: "A styled bridal portrait session in mint", placeholderTone: 3 },
    layout: "wide",
    gallery: [{ type: "image", aspect: "4:5", alt: "Detail shot from the mint session", placeholderTone: 6 }],
    featured: false,
  },
  {
    slug: "magenta",
    title: "Magenta",
    category: "Asoebi Moments",
    date: "2026-07-19",
    services: ["Asoebi Moments"],
    excerpt: "Bold colour, shot to actually hold up in print.",
    story: [
      "Strong colour is easy to get wrong in a photograph, either blown out or muddy. This session was lit and edited specifically to keep the magenta true.",
    ],
    hero: { type: "image", aspect: "4:5", alt: "An asoebi look in magenta", placeholderTone: 2 },
    layout: "wide",
    gallery: [],
    featured: false,
  },
  {
    slug: "scarlet-hour",
    title: "Scarlet Hour",
    category: "Social Content",
    date: "2025-12-20",
    services: ["Social Content"],
    excerpt: "A short-form cut, shot on mobile and edited the same evening.",
    story: [
      "Built for a feed, not a frame. Same eye, different pace, different aspect ratio, out within hours instead of weeks.",
    ],
    hero: { type: "video", aspect: "9:16", alt: "A short-form reel in red", placeholderTone: 5 },
    layout: "tall",
    gallery: [],
    featured: false,
  },
  {
    slug: "rose-and-marble",
    title: "Rose & Marble",
    category: "Wedding",
    date: "2026-09-05",
    services: ["Wedding", "Bridal Prep"],
    excerpt: "A wedding that started with a bridal prep session the morning before.",
    story: [
      "Two sessions, one story: the quieter portrait sitting the day before, then the wedding itself. The gallery holds both together as one set.",
    ],
    hero: { type: "image", aspect: "4:5", alt: "A bride in rose tones against a marble backdrop", placeholderTone: 6 },
    layout: "feature",
    gallery: [
      { type: "image", aspect: "4:5", alt: "The bridal prep sitting the day before", placeholderTone: 4 },
      { type: "image", aspect: "16:9", alt: "The wedding day itself", placeholderTone: 8 },
    ],
    featured: true,
  },
  {
    slug: "violet-garden",
    title: "Violet Garden",
    category: "Asoebi Moments",
    date: "2026-05-30",
    services: ["Asoebi Moments", "Social Content"],
    excerpt: "A garden setting, a coordinated look, and a short cut made for sharing.",
    story: [
      "Shot as a full session and cut twice: a longer gallery for keeping, a short vertical edit for sharing the same afternoon.",
    ],
    hero: { type: "video", aspect: "4:5", alt: "An asoebi look shot in a garden setting", placeholderTone: 7 },
    layout: "wide",
    gallery: [],
    featured: false,
  },
  {
    slug: "snapinstato-756138003-18463126699114426-1402569017467565764-n",
    title: "Snapinstato 756138003 18463126699114426 1402569017467565764 N", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/snapinstato-756138003-18463126699114426-1402569017467565764-n/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "snapinstato-759164127-18463126735114426-6119565364810213889-n",
    title: "Snapinstato 759164127 18463126735114426 6119565364810213889 N", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/snapinstato-759164127-18463126735114426-6119565364810213889-n/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "snapinstato-761515126-18463126714114426-2866860772617575004-n",
    title: "Snapinstato 761515126 18463126714114426 2866860772617575004 N", // REPLACE with the real title
    category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"], // REPLACE
    excerpt: "REPLACE with a one-line summary.",
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/snapinstato-761515126-18463126714114426-2866860772617575004-n/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "snapinstato-aqme67tqtdhjdxdcrmt7f3pq-upugqi7k6osduk-uqxnh41bvwywcw4mktplmy0sojobntjtpi2-9sj2-zjxkkci1ms8ewtvrburbr8",
    title: "Snapinstato Aqme67tqtdhjdxdcrmt7f3pq Upugqi7k6osduk Uqxnh41bvwywcw4mktplmy0sojobntjtpi2 9sj2 Zjxkkci1ms8ewtvrburbr8", // REPLACE with the real title
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
      src: "/media/work/snapinstato-aqme67tqtdhjdxdcrmt7f3pq-upugqi7k6osduk-uqxnh41bvwywcw4mktplmy0sojobntjtpi2-9sj2-zjxkkci1ms8ewtvrburbr8/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "snapinstato-aqnml8-ebelc0vkcfcjbcp5komydbd21n-0-o4f-etsaffdjeiepf6sizpt5u5na05ohp2c8jyn0abyiofy2xkz7bldw824dlzcodg4-1",
    title: "Snapinstato Aqnml8 Ebelc0vkcfcjbcp5komydbd21n 0 O4f Etsaffdjeiepf6sizpt5u5na05ohp2c8jyn0abyiofy2xkz7bldw824dlzcodg4 1", // REPLACE with the real title
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
      src: "/media/work/snapinstato-aqnml8-ebelc0vkcfcjbcp5komydbd21n-0-o4f-etsaffdjeiepf6sizpt5u5na05ohp2c8jyn0abyiofy2xkz7bldw824dlzcodg4-1/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "snapinstato-aqogmwjl9hm-grbc9tltcg35-zsyjl-wttmnuyfvarfw9kljsxvfc9gbsu6wn82pwymr-0uilfe3qi3wscqezxk4gftjmfx2cdaxjjs",
    title: "Snapinstato Aqogmwjl9hm Grbc9tltcg35 Zsyjl Wttmnuyfvarfw9kljsxvfc9gbsu6wn82pwymr 0uilfe3qi3wscqezxk4gftjmfx2cdaxjjs", // REPLACE with the real title
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
      src: "/media/work/snapinstato-aqogmwjl9hm-grbc9tltcg35-zsyjl-wttmnuyfvarfw9kljsxvfc9gbsu6wn82pwymr-0uilfe3qi3wscqezxk4gftjmfx2cdaxjjs/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "REPLACE with the first story paragraph.",
    ],
  },

  {
    slug: "snapinstato-aqozociwnf6peonixhrb36m08ty3wpszwhqofkfyaw49jqsmwls9sch1zabk7xmx3e2vkn8pgmq300rlnqvb8thvmzos-xn8oxsyeac",
    title: "Snapinstato Aqozociwnf6peonixhrb36m08ty3wpszwhqofkfyaw49jqsmwls9sch1zabk7xmx3e2vkn8pgmq300rlnqvb8thvmzos Xn8oxsyeac", // REPLACE with the real title
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
      src: "/media/work/snapinstato-aqozociwnf6peonixhrb36m08ty3wpszwhqofkfyaw49jqsmwls9sch1zabk7xmx3e2vkn8pgmq300rlnqvb8thvmzos-xn8oxsyeac/hero.mp4",
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
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-1/hero.jpg",
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
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-2/hero.jpg",
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
    featured: false,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "REPLACE — describe this shot for screen readers",
      src: "/media/work/piece-3/hero.jpg",
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
    featured: false,
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
    featured: false,
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
    featured: false,
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
    featured: false,
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
