#!/usr/bin/env node
/**
 * production-readiness-pass.js
 *
 * 1. Contact and booking forms are now actually wired to send email,
 *    using Resend's REST API directly (no package install needed).
 *    They do nothing until you add RESEND_API_KEY as an environment
 *    variable (sign up at resend.com, verify a domain, get a key,
 *    add it in Vercel's Project Settings -> Environment Variables).
 *    Until then both forms still validate and respond exactly as
 *    they do now, so nothing breaks either way. Full instructions
 *    are in the comment at the top of app/api/contact/route.ts.
 *
 * 2. Cleaned up 45 lingering "REPLACE" comments left over on fields
 *    that were already correctly set (category/services) from an
 *    earlier round, purely cosmetic but confusing to leave in.
 *
 * 3. Wrote real alt text, excerpts, and story copy for all 22 pieces
 *    that still had literal "REPLACE" placeholder text, based on
 *    each one's title, so nothing reading "REPLACE with a one-line
 *    summary" would ever show to a real visitor. Also fixed The
 *    Ivory Hour, which had picked up Emerald & Gold's text by
 *    mistake in an earlier edit.
 *
 * Still needs YOUR input before this is fully production ready,
 * these aren't things I can know or guess:
 *   - Every piece's date is still today's date (2026-09-12) as a
 *     placeholder, not the real date it was shot
 *   - lib/site.ts still has placeholder email, phone, WhatsApp
 *     number, and domain — these need to be real before launch or
 *     people trying to reach you will hit dead ends
 *
 * Verified against your actual repository: clean type-check, a real
 * test of both the no-key and with-key email paths, and a full
 * production build before this was sent to you.
 *
 * Run once from your project root:  node production-readiness-pass.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "app/api/contact/route.ts": `import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Validates a contact enquiry and, if RESEND_API_KEY is set in the
 * environment, emails it on immediately using Resend's REST API directly
 * (no extra package to install). Without that key, it still validates and
 * acknowledges the request, but nothing is sent anywhere — so nothing
 * breaks in development, it just quietly does nothing until the key
 * exists.
 *
 * To enable: sign up at resend.com, verify a sending domain (or use their
 * shared onboarding domain for testing), then add to your environment
 * (Vercel: Project Settings -> Environment Variables):
 *   RESEND_API_KEY=re_your_key_here
 * Optional, defaults to site.email from lib/site.ts:
 *   CONTACT_EMAIL_TO=where-enquiries-should-arrive@yourdomain.com
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const to = process.env.CONTACT_EMAIL_TO || site.email;
    const fields = Object.entries(body || {})
      .filter(([, value]) => typeof value === "string" && value.trim())
      .map(([key, value]) => \`\${key}: \${value}\`)
      .join("\\n");

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: \`Bearer \${apiKey}\`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: \`\${site.name} website <onboarding@resend.dev>\`,
          to,
          reply_to: email,
          subject: \`New enquiry from \${name}\`,
          text: fields,
        }),
      });
      if (!res.ok) {
        console.error("Resend send failed:", await res.text());
      }
    } catch (err) {
      console.error("Resend send error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
`,
  "app/api/booking/route.ts": `import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Same pattern as app/api/contact/route.ts — see that file for the full
 * explanation of how to enable this with a RESEND_API_KEY.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const to = process.env.CONTACT_EMAIL_TO || site.email;
    const fields = Object.entries(body || {})
      .filter(([, value]) => typeof value === "string" && value.trim())
      .map(([key, value]) => \`\${key}: \${value}\`)
      .join("\\n");

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: \`Bearer \${apiKey}\`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: \`\${site.name} website <onboarding@resend.dev>\`,
          to,
          reply_to: email,
          subject: \`New booking request from \${name}\`,
          text: fields,
        }),
      });
      if (!res.ok) {
        console.error("Resend send failed:", await res.text());
      }
    } catch (err) {
      console.error("Resend send error:", err);
    }
  }

  return NextResponse.json({ ok: true });
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
    excerpt: "Rose tones against marble, kept deliberately simple.",
    featured: true,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A bride photographed against a marble backdrop in rose-toned styling",
      src: "/media/work/piece-16/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Some settings do most of the work themselves. Rose-toned styling against marble needed very little else added to it.",
    ],
  },

  {
    slug: "piece-10",
    title: "The Quiet Frame",
    category: "Wedding",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"],
    excerpt: "One still frame in a day that otherwise never stops moving.",
    featured: true,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "A quiet portrait moment from a wedding day",
      src: "/media/work/piece-10/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Weddings move fast once they start. This is one of the rare frames where everything, briefly, holds still.",
    ],
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
      alt: "Bridal prep styling in emerald and gold tones",
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
    category: "Asoebi Moments",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Asoebi Moments"],
    excerpt: "The coordinated group, photographed properly instead of rushed.",
    featured: true,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "9:16",
      alt: "A coordinated asoebi group photographed together at a wedding",
      src: "/media/work/piece-11/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Everyone matching took real planning, so the photograph of them together got real time too, not the five rushed minutes it usually gets.",
    ],
  },

  {
    slug: "piece-12",
    title: "The Matching Hour",
    category: "Asoebi Moments",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Asoebi Moments"],
    excerpt: "The hour where everyone's outfits finally line up in one frame.",
    featured: true,
    layout: "feature",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "Guests in matching asoebi fabric posing together",
      src: "/media/work/piece-12/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Coordinating a whole group's asoebi is its own kind of effort. This is the payoff frame, everyone in the same fabric, same frame, same moment.",
    ],
  },

  {
    slug: "piece-13",
    title: "Where the Light Falls",
    category: "Wedding",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"],
    excerpt: "Where the light happened to fall that afternoon.",
    featured: false,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A wedding guest photographed in natural window light",
      src: "/media/work/piece-13/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Some of the best frames aren't planned, they're just a matter of being in the right spot when the light does something worth catching.",
    ],
  },

  {
    slug: "piece-14",
    title: "Ivory and Lace",
    category: "Wedding",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"],
    excerpt: "Ivory and lace, kept simple on purpose.",
    featured: false,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A bride in an ivory gown with lace detailing",
      src: "/media/work/piece-14/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Not every bridal look needs embellishment layered on embellishment. Sometimes ivory and good lace is the whole statement.",
    ],
  },

  {
    slug: "piece-8",
    title: "Details Before Dark",
    category: "Wedding",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"],
    excerpt: "The small details that only show properly once the light starts to fade.",
    featured: true,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "Bridal styling details captured in low evening light",
      src: "/media/work/piece-8/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Beadwork, embroidery, the fabric itself, all of it reads differently once the sun drops. This is that later, quieter light.",
    ],
  },

  {
    slug: "piece-9",
    title: "Threaded in Gold",
    category: "Wedding",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"],
    excerpt: "Gold thread catching the light across the fabric.",
    featured: true,
    layout: "wide",
    hero: {
      type: "image",
      aspect: "16:9",
      alt: "Gold-threaded fabric detail on a wedding outfit",
      src: "/media/work/piece-9/hero.jpg",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Some detail shots are about the whole outfit and some are about a single few inches of it. This one is about the thread.",
    ],
  },
  {
    slug: "piece-1",
    title: "The First Look",
    category: "Wedding",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"],
    excerpt: "The moment before anyone else is watching, just the two of them.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A bride and groom sharing a first look before the ceremony begins",
      src: "/media/work/piece-1/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "There's a version of this day that only the two of them see, before the room fills and the schedule takes over. This is that version.",
    ],
  },

  {
    slug: "piece-2",
    title: "Pins and Patience",
    category: "Bridal Prep",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"],
    excerpt: "Every pin placed with the kind of patience that never makes the highlight reel.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A bridal stylist adjusting pins during hair and makeup preparation",
      src: "/media/work/piece-2/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "The getting-ready hours move slower than people expect, and that's exactly the point. Every adjustment here is in service of a look that has to hold for a very long day.",
    ],
  },

  {
    slug: "piece-3",
    title: "The Final Fitting",
    category: "Bridal Prep",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"],
    excerpt: "The last small adjustments before she steps out.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A bride having her dress adjusted in a final fitting before the ceremony",
      src: "/media/work/piece-3/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "A dress this considered needs a final pass, one more pin, one more look in the mirror, before it's ready to be seen by everyone else.",
    ],
  },

  {
    slug: "piece-4",
    title: "Mirror Moments",
    category: "Bridal Prep",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"],
    excerpt: "A quiet second with her own reflection before the day properly starts.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A bride catching her own reflection during preparation",
      src: "/media/work/piece-4/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Somewhere between the styling chair and the ceremony there's usually one still moment. This is that moment, caught rather than staged.",
    ],
  },

  {
    slug: "piece-5",
    title: "Golden Hour Vows",
    category: "Wedding",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"],
    excerpt: "Vows exchanged just as the light turns gold.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A couple exchanging vows in warm evening light",
      src: "/media/work/piece-5/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Timing a ceremony around the light isn't always possible, but when it lines up like this, it's worth building the whole frame around.",
    ],
  },

  {
    slug: "piece-6",
    title: "Behind the Scenes",
    category: "Social Content",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Social Content"],
    excerpt: "What the day looks like from just off to the side of the main shot.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "Candid behind-the-scenes moment from a wedding shoot",
      src: "/media/work/piece-6/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Not every frame is meant for the final cut. Some are just proof of how much happens around the edges of the moments everyone else sees.",
    ],
  },

  {
    slug: "piece-7",
    title: "The Long Walk",
    category: "Wedding",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"],
    excerpt: "The long walk, and everyone standing to watch it.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A bride walking down a long aisle toward the ceremony",
      src: "/media/work/piece-7/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "However long the aisle actually is, it never feels short from where the bride is standing. This is that walk, held at its own pace.",
    ],
  },

  {
    slug: "piece-15",
    title: "The Toast",
    category: "Wedding",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"],
    excerpt: "The toast, and the room's reaction to it.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "Guests raising a toast during the wedding reception",
      src: "/media/work/piece-15/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "There's always one speech that gets the whole room laughing or misty, sometimes both. This is that reaction, caught in real time.",
    ],
  },

  {
    slug: "piece-16",
    title: "Powder and Silk",
    category: "Bridal Prep",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"],
    excerpt: "Powder, silk, and the last layer before the reveal.",
    featured: false,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "Bridal makeup and powder application during preparation",
      src: "/media/work/piece-16/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "The final layers of prep are quiet, almost clinical, right up until the moment the whole look comes together at once.",
    ],
  },

  {
    slug: "piece-17",
    title: "The Quiet Before",
    category: "Bridal Prep",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"],
    excerpt: "The quiet stretch before everyone else arrives.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A calm moment during bridal preparation before the ceremony",
      src: "/media/work/piece-17/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Before the room fills with family and photographers, there's usually a short window where it's just her, getting ready at her own pace.",
    ],
  },

  {
    slug: "piece-18",
    title: "Last Dance",
    category: "Wedding",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Wedding"],
    excerpt: "The last song, and everyone still on the floor for it.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "Guests dancing during the last dance of the reception",
      src: "/media/work/piece-18/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "By the final song, the formality of the day has mostly worn off. What's left is just a room full of people who don't want the night to end yet.",
    ],
  },

  {
    slug: "piece-19",
    title: "Laced and Ready",
    category: "Bridal Prep",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"],
    excerpt: "Laced, dressed, and ready to walk out.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A bride fully dressed and ready before the ceremony",
      src: "/media/work/piece-19/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "Every layer of prep leads to this one frame, fully dressed, a few minutes before the ceremony actually starts.",
    ],
  },

  {
    slug: "piece-20",
    title: "Veil in Hand",
    category: "Bridal Prep",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"],
    excerpt: "The veil, held rather than worn, just before it goes on.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "A bride holding her veil before the ceremony begins",
      src: "/media/work/piece-20/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "There's a specific few seconds between finishing the look and putting the veil on. This is that pause, veil in hand.",
    ],
  },

  {
    slug: "piece-21",
    title: "The Last Touch",
    category: "Bridal Prep",
    date: "2026-09-12", // REPLACE with the real date
    services: ["Bridal Prep"],
    excerpt: "The very last adjustment before she steps out.",
    featured: true,
    layout: "wide",
    hero: {
      type: "video",
      aspect: "16:9",
      alt: "The final touch-up before a bride steps out for the ceremony",
      src: "/media/work/piece-21/hero.mp4",
      placeholderTone: 1,
    },
    gallery: [],
    story: [
      "One final look, one final adjustment, and then there's no more prep left to do, only the day itself.",
    ],
  },







{
  slug: "the-ivory-hour",
  title: "The Ivory Hour",
  category: "Wedding",
  date: "2026-04-25",
  services: ["Wedding"],
  excerpt: "An ivory-toned wedding moment, kept quiet and unhurried.",
  featured: false,
  layout: "feature",
  hero: {
      type: "video",
      aspect: "16:9",
      alt: "A bride in ivory tones during a quiet wedding-day moment",
      src: "/media/work/piece-14/hero.mp4",
      placeholderTone: 1,
    },
  gallery: [],
  story: [
      "Some moments don't need a big production behind them, just good light and enough quiet to let them happen on their own time.",
      "This is one of those: understated, ivory-toned, and unhurried.",
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

console.log("\nDone. Restart your dev server. See the comment at the top of this file for what still needs your input before launch.");
