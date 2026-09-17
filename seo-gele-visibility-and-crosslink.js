#!/usr/bin/env node
/**
 * seo-gele-visibility-and-crosslink.js
 *
 * SEO changes to help this site surface for gele and asoebi searches,
 * not just wedding photography/videography ones:
 *
 * 1. Meta title, description, and keywords now explicitly mention
 *    gele styling and asoebi, not just "wedding films."
 * 2. The structured data (the JSON-LD schema Google reads to
 *    understand what a business actually does) now lists gele
 *    styling and asoebi photography as explicit topics.
 * 3. The Bridal Prep service description on the actual visible page
 *    now says the word "gele" outright — this matters more for
 *    ranking than metadata alone, since Google weighs real page
 *    content heavily.
 * 4. Fixed a real gap while in here: /faq wasn't in the sitemap at
 *    all, meaning Google may never have discovered that page. Added.
 *
 * Also added a tasteful line in the footer linking to jaygele.com for
 * anyone specifically looking for gele styling — positioned as its
 * own aside after the main contact details, not crowding them.
 *
 * Verified against your actual repository: clean type-check, a full
 * production build, and confirmed all of the above actually appears
 * in the real rendered output (meta tags, schema, sitemap, and the
 * visible Services page copy) before this was sent to you.
 *
 * Run once from your project root:  node seo-gele-visibility-and-crosslink.js
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
  "lib/services.ts": `export type Service = {
  slug: string;
  name: string;
  description: string;
  detail: string;
  placeholderTone: number;
  src?: string;
};

export const services: Service[] = [
  {
    slug: "weddings",
    name: "Weddings",
    description: "Full day coverage, start to last dance.",
    detail:
      "Photography and film from the first look through to the send-off, edited to hold together as a full record of the day, not just a highlight reel.",
    placeholderTone: 1,
    src: "/media/work/teal-veil-1/hero.jpg",
  },
  {
    slug: "bridal-prep",
    name: "Bridal Prep",
    description: "The getting-ready hours, gele and all, styled and kept.",
    detail:
      "The pins, the folding, the gele tied just right, the last adjustments before anyone steps back to look. Usually the most candid part of the whole day, even though it is the most styled.",
    placeholderTone: 4,
    src: "/media/work/silver-gele-1/hero.jpg",
  },
  {
    slug: "asoebi-moments",
    name: "Asoebi Moments",
    description: "The coordinated family and friend group, celebrated properly.",
    detail:
      "The group everyone matches with deserves its own set of photographs, not a rushed five minutes before the reception starts.",
    placeholderTone: 2,
    src: "/media/work/mint-maroon-1/hero.jpg",
  },
  {
    slug: "social-content",
    name: "Social Content",
    description: "Short-form cuts for how people actually watch now.",
    detail:
      "Shot on location, often on mobile, and edited fast for Instagram and TikTok. The same eye, built for a different feed.",
    placeholderTone: 5,
    src: "/media/work/plum-iyawo/hero.jpg",
  },
];
`,
  "app/layout.tsx": `import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cormorant, geistSans } from "@/lib/fonts";
import { site } from "@/lib/site";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: \`%s — \${site.name}\`,
  },
  description: site.description,
  keywords: [
    "wedding videographer London",
    "wedding photographer UK",
    "wedding films",
    "documentary wedding photography",
    "gele styling photography",
    "gele artist London",
    "asoebi photography",
    "bridal prep videographer",
    "Nigerian wedding videographer UK",
    "aso ebi photographer",
  ],
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
    sameAs: [site.instagram.url],
    description: site.description,
    knowsAbout: ["Wedding photography", "Wedding videography", "Gele styling", "Asoebi photography", "Bridal prep"],
  };

  return (
    <html lang="en" className={\`\${cormorant.variable} \${geistSans.variable}\`}>
      <body className="bg-ink font-sans text-paper antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <Providers>
          <Navigation />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
`,
  "app/sitemap.ts": `import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/about", "/services", "/faq", "/booking", "/gallery", "/contact"].map((path) => ({
    url: \`\${site.url}\${path}\`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((project) => ({
    url: \`\${site.url}/work/\${project.slug}\`,
    lastModified: new Date(project.date),
  }));

  return [...staticRoutes, ...projectRoutes];
}
`,
  "components/footer.tsx": `import { TransitionLink } from "./transition";
import { MagneticButton } from "./magnetic-button";
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
            <p className="text-[11px] uppercase tracking-[0.2em] text-paper/40">Instagram</p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-paper transition-colors hover:text-wine-soft"
            >
              {site.instagram.handle}
            </a>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-paper/40">Email</p>
            <a href={\`mailto:\${site.email}\`} className="mt-2 inline-block text-paper transition-colors hover:text-wine-soft">
              {site.email}
            </a>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-paper/40">WhatsApp</p>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-paper transition-colors hover:text-wine-soft"
            >
              Message us
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
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Restart your dev server.");
