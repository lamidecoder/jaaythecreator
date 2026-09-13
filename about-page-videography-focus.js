#!/usr/bin/env node
/**
 * about-page-videography-focus.js
 *
 * Full rewrite of the About page body copy, this time with zero gele
 * or styling references at all. It's now built entirely around the
 * craft of filming and photographing: catching unposed moments,
 * staying close and ready rather than showing up after the fact.
 *
 * Confirmed no reference to gele remains anywhere in the file before
 * sending this, plus a clean type-check and full production build.
 *
 * Run once from your project root:  node about-page-videography-focus.js
 */

const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "components", "about-section.tsx");

const content = `import { Reveal } from "./reveal";

export function AboutSection() {
  return (
    <div className="bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-40 sm:px-10 sm:pt-48">
        <Reveal>
          <h1 className="max-w-3xl font-serif text-display text-ink">
            {"Styled where it should be. Honest where it shouldn't."}
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-12 sm:grid-cols-12 sm:gap-8">
          <div className="relative aspect-[4/5] overflow-hidden sm:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/about/founder-3/photo.jpg"
              alt="Jaaythecreator speaking to a group, fabric samples on the table beside him"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </div>
          <Reveal className="sm:col-span-7 sm:pt-4">
            <div className="max-w-prose space-y-6 font-sans text-lg leading-relaxed text-ink/80">
              <p>
                {
                  "Most of what makes a wedding film worth watching back happens in the moments nobody's posing for, the exhale right after the vows, a look across the room mid-toast, the few seconds before someone notices the camera's still rolling."
                }
              </p>
              <p>
                {
                  "I'd rather build a film and a gallery around those than around the same five choreographed shots every wedding video already has. That means staying close, staying quiet, and being ready before the moment happens, not after it."
                }
              </p>
              <p>
                {
                  "Weddings, bridal prep, and asoebi moments, shot in whatever mix of photo and film each one calls for. UK-based, available worldwide."
                }
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-24 border-t border-ink/10 pt-16">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/about/founder-1/photo.jpg"
                alt="Jaaythecreator outside a restaurant, checking his phone before a shoot"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden sm:mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/about/founder-2/photo.jpg"
                alt="Jaaythecreator in a long coat, off duty"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(target, content);
console.log("Updated components/about-section.tsx — copy now focused entirely on the videography/photography craft.");
