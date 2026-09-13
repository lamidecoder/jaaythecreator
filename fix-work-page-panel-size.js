#!/usr/bin/env node
/**
 * fix-work-page-panel-size.js
 *
 * Work page panels were noticeably smaller than the homepage's
 * Selected Moments panels. Enlarged the height pattern to match:
 * 75vh/60vh/85vh on desktop, up from 70vh/55vh/50vh.
 *
 * Run once from your project root:  node fix-work-page-panel-size.js
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

/** Repeating span/height rhythm so the grid reads as a magazine page
 * rather than a uniform repeat, no matter how many pieces are in the
 * current filter. Cycles every 5 items. */
const SIZE_PATTERN: { span: string; height: string }[] = [
  { span: "sm:col-span-7", height: "h-[55vh] sm:h-[75vh]" },
  { span: "sm:col-span-5", height: "h-[55vh] sm:h-[75vh]" },
  { span: "sm:col-span-8", height: "h-[50vh] sm:h-[60vh]" },
  { span: "sm:col-span-4", height: "h-[50vh] sm:h-[60vh]" },
  { span: "sm:col-span-12", height: "h-[60vh] sm:h-[85vh]" },
];

export function WorkGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("All");

  const shown = useMemo(() => {
    const base = projects.filter((project) => !EXCLUDED_FROM_WORK.includes(project.slug));
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
            const { span, height } = SIZE_PATTERN[index % SIZE_PATTERN.length];
            return <MagazineCard key={project.slug} project={project} span={span} height={height} />;
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
console.log("Updated components/work-grid.tsx — panels now match the homepage's scale.");
