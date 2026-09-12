#!/usr/bin/env node
/**
 * fix-design-alignment.js
 *
 * Brings the real site's visual system fully in line with the HTML
 * preview you approved (jaaythecreator-preview-v7.html). Until now only
 * the hero sizing bug had been ported over, the rest of the palette and
 * type system was still the original build. This patches the remaining
 * gap:
 *
 * - Colours: ink, paper, bone, and wine now use the same hex values as
 *   the preview (a truer near-black, warmer cream, and a confident red
 *   accent instead of the original oxblood).
 * - Typeface: the serif switches from Fraunces to Cormorant Garamond,
 *   matching the preview's sharper, more fashion-editorial letterforms.
 * - Placeholder tones: the 8 gradient placeholders now match the real
 *   jewel-tone palette (emerald and gold, magenta, mint, ivory, red,
 *   rose gold, violet, lilac) instead of the original warm-ink tones.
 * - Heading sizes: display, h1, and h2 are resized to the preview's
 *   values, the same fix already applied to the hero specifically.
 *
 * Run once from your project root:  node fix-design-alignment.js
 */

const fs = require("fs");
const path = require("path");

const files = {
  "lib/placeholder-tones.ts": `/**
 * Eight tonal gradients built from the real jewel-tone palette seen in the
 * studio's actual Instagram content (emerald and gold, magenta, mint,
 * ivory, red, rose gold, violet, lilac), standing in for media that hasn't
 * been added yet. No external images or stock footage are used anywhere
 * in this project — once a real photo or film exists, setting \`src\` on
 * that item's MediaAsset replaces this automatically.
 */
export const placeholderTones = [
  "linear-gradient(145deg, #0B4A3A 0%, #1F6E4F 45%, #B8975A 100%)", // emerald + gold
  "linear-gradient(140deg, #3A0F24 0%, #A61257 50%, #E0447F 100%)", // magenta
  "linear-gradient(155deg, #C9E8DD 0%, #8FC9B4 50%, #5D9C88 100%)", // mint
  "linear-gradient(140deg, #FBF6EF 0%, #F0DCE0 55%, #D9B8BE 100%)", // ivory / blush
  "linear-gradient(150deg, #2A0808 0%, #7A1414 50%, #B8342A 100%)", // red
  "linear-gradient(145deg, #F4E3D3 0%, #E0A9A0 55%, #B9776E 100%)", // rose gold
  "linear-gradient(150deg, #2E1440 0%, #6B3A96 50%, #A374C7 100%)", // violet
  "linear-gradient(150deg, #D8C7E8 0%, #B79BCB 50%, #8A6BA8 100%)", // lilac
];

export function placeholderTone(index: number) {
  return placeholderTones[(index - 1 + placeholderTones.length) % placeholderTones.length];
}
`,
  "tailwind.config.ts": `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black, matching the studio's actual Instagram aesthetic
        // rather than a warmer stand-in.
        ink: "#0A0A0A",
        // Warm cream used for the site's "breathing" sections (About,
        // Services) rather than as the default background.
        paper: "#FAF8F1",
        // Muted warm grey for secondary text on dark sections.
        bone: "#8F8B82",
        // The single sparing accent: a confident red, never used as the
        // main colour of a large surface or a full paragraph of text.
        wine: "#B22318",
        "wine-soft": "#D66B5F",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.4rem, 8vw, 5.8rem)", { lineHeight: "1.03", letterSpacing: "-0.01em", fontWeight: "400" }],
        "display-lg": ["clamp(2.8rem, 10vw, 7.8rem)", { lineHeight: "1.02", letterSpacing: "-0.01em", fontWeight: "400" }],
        h1: ["clamp(1.9rem, 5vw, 3.2rem)", { lineHeight: "1.1", fontWeight: "400" }],
        h2: ["clamp(1.5rem, 3.2vw, 2.2rem)", { lineHeight: "1.15", fontWeight: "400" }],
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.65, 0, 0.15, 1)",
        reveal: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      transitionDuration: {
        curtain: "900ms",
      },
      maxWidth: {
        prose: "62ch",
      },
    },
  },
  plugins: [],
};

export default config;
`,
  "lib/fonts.ts": `import { Cormorant_Garamond } from "next/font/google";
import { GeistSans } from "geist/font/sans";

// Editorial serif for display type: the wordmark, the big statement lines,
// pull quotes. Cormorant Garamond's thin, sharp, high-fashion character
// was chosen deliberately over softer variable serifs (Fraunces and
// similar) that have become a common default look, on the studio's own
// design feedback.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

export const geistSans = GeistSans;
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
  keywords: ["wedding videographer London", "wedding photographer UK", "wedding films", "documentary wedding photography"],
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
};

for (const [relPath, content] of Object.entries(files)) {
  const target = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  console.log("Updated " + relPath);
}

console.log("\nDone. Your dev server should pick these up automatically. If fonts look unchanged, do a hard refresh (Ctrl+Shift+R).");
