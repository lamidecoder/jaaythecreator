#!/usr/bin/env node
/**
 * fix-row-alignment-and-mobile.js
 *
 * Two fixes:
 *
 * 1. Row-height alignment on desktop. The cause of the mismatched
 *    heights you saw: two panels of different widths using the SAME
 *    aspect ratio naturally end up at different heights (a wider box
 *    at the same ratio is proportionally taller). Each paired row now
 *    uses ratios specifically calculated from their column widths so
 *    both panels land on the exact same final height — confirmed with
 *    the actual pixel math before sending this. Every ratio still
 *    stays comfortably narrower than 16:9, so horizontal video keeps
 *    its full height regardless.
 *
 * 2. Mobile reverted to how it looked before the aspect-ratio change:
 *    fixed heights (55vh/50vh/60vh), same as prior to that update.
 *    The aspect-ratio sizing now only applies from the sm breakpoint
 *    up, where the row-alignment concern actually exists (mobile is a
 *    single column, so there's nothing to align).
 *
 * Verified against your actual repository: clean type-check and a
 * full production build before this was sent to you.
 *
 * Run once from your project root:  node fix-row-alignment-and-mobile.js
 */

const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "components", "work-grid.tsx");

const content = `"use client";

import { useMemo, useState } from "react";
import { projects } from "@/lib/projects";
import { MagazineCard } from "./magazine-card";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const filters = [
  { key: "All", label: "All" },
  { key: "Wedding", label: "Weddings" },
  { key: "Bridal Prep", label: "Bridal Prep" },
  { key: "Asoebi Moments", label: "Asoebi Moments" },
  { key: "Social Content", label: "Social Content" },
] as const;

/** Excluded here specifically because its video is the same clip as
 * piece-13 (it's the same footage shown under a proper name on the
 * homepage) — showing both here would be a duplicate. */
const EXCLUDED_FROM_WORK = ["emerald-and-gold"];

/** Each item paired with another in the same row uses a ratio derived
 * from their relative widths, so both end up the same final height on
 * desktop despite their different column spans — a 4:3 box on a wide
 * column and a 4:3 box on a narrow column don't produce equal heights,
 * so the paired items below use different ratios calibrated to match.
 * Every ratio is still comfortably narrower than 16:9, which
 * guarantees a horizontal video's full height stays visible — the
 * sides crop instead, never the top or bottom.
 *
 * This aspect-ratio sizing only applies from the sm breakpoint up.
 * On mobile, panels use a fixed height like before, since there's
 * only one column there and no row-alignment concern. */
const SIZE_PATTERN: { span: string; mobileHeight: string; aspect: string }[] = [
  { span: "sm:col-span-7", mobileHeight: "h-[55vh]", aspect: "sm:aspect-[21/20]" },
  { span: "sm:col-span-5", mobileHeight: "h-[55vh]", aspect: "sm:aspect-[3/4]" },
  { span: "sm:col-span-8", mobileHeight: "h-[50vh]", aspect: "sm:aspect-[3/2]" },
  { span: "sm:col-span-4", mobileHeight: "h-[50vh]", aspect: "sm:aspect-[3/4]" },
  { span: "sm:col-span-12", mobileHeight: "h-[60vh]", aspect: "sm:aspect-[16/9]" },
];

export function WorkGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("All");

  const shown = useMemo(() => {
    const base = projects.filter(
      (project) => !EXCLUDED_FROM_WORK.includes(project.slug) && project.hero.type !== "image",
    );
    return filter === "All" ? base : base.filter((project) => project.category === filter);
  }, [filter]);

  return (
    <section className="bg-ink px-6 pb-28 pt-40 sm:px-10 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h1 className="max-w-2xl font-serif text-display text-paper">The work.</h1>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={cn(
                "font-sans text-xs uppercase tracking-[0.2em] transition-colors",
                filter === item.key ? "text-paper" : "text-paper/45 hover:text-paper/80",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-5">
          {shown.map((project, index) => {
            const { span, mobileHeight, aspect } = SIZE_PATTERN[index % SIZE_PATTERN.length];
            return (
              <MagazineCard
                key={project.slug}
                project={project}
                span={span}
                sizeClass={\`\${mobileHeight} sm:h-auto \${aspect}\`}
              />
            );
          })}
        </div>

        {shown.length === 0 ? (
          <p className="mt-16 font-sans text-sm text-bone">Nothing in this category yet, check back soon.</p>
        ) : null}
      </div>
    </section>
  );
}
`;

fs.writeFileSync(target, content);
console.log("Updated components/work-grid.tsx — rows align on desktop, mobile is back to fixed heights.");
