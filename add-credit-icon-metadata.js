#!/usr/bin/env node
/**
 * add-credit-icon-metadata.js
 *
 * 1. Footer now credits "Built by NexusHouseUK" next to the
 *    copyright line.
 *
 * 2. Real favicon added (app/icon.tsx) plus the iOS home-screen
 *    variant (app/apple-icon.tsx) — both generated automatically by
 *    Next.js, no static image file needed. Currently a simple "J"
 *    monogram on the site's ink background. Confirmed both produce
 *    real, correctly-sized PNGs and show up in the page's <link>
 *    tags automatically before this was sent.
 *
 * 3. Open Graph share image added (app/opengraph-image.tsx) — this
 *    is what shows as the preview when the site link is shared on
 *    social media, WhatsApp, iMessage, etc. Your metadata already
 *    had Open Graph and Twitter card tags configured (title,
 *    description, keywords, JSON-LD schema — that was all already
 *    solid), it was just missing an actual image, which this fixes.
 *    Confirmed it's automatically picked up in the page's meta tags
 *    too.
 *
 * Worth knowing: the italic serif styling on both images doesn't
 * fully render — Next.js's image generation needs fonts explicitly
 * loaded as font files rather than referenced by name, and I
 * couldn't fetch a font file to test in this environment. Both still
 * look clean with the fallback font, just not your exact Cormorant
 * Garamond typeface. Can revisit if you want that specific match.
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node add-credit-icon-metadata.js
 */

const fs = require("fs");
const path = require("path");

const files = {
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
  "app/icon.tsx": `import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          color: "#FAF8F1",
          fontSize: 22,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
        }}
      >
        J
      </div>
    ),
    { ...size },
  );
}
`,
  "app/apple-icon.tsx": `import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          color: "#FAF8F1",
          fontSize: 120,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
        }}
      >
        J
      </div>
    ),
    { ...size },
  );
}
`,
  "app/opengraph-image.tsx": `import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            color: "#FAF8F1",
            textAlign: "center",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8F8B82",
            textAlign: "center",
          }}
        >
          Weddings · Bridal Prep · Asoebi Moments
        </div>
      </div>
    ),
    { ...size },
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
