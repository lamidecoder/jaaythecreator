"use client";

import { useMemo, useState } from "react";
import { projects } from "@/lib/projects";
import { ProjectCard } from "./project-card";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const filters = [
  { key: "All", label: "All" },
  { key: "Wedding", label: "Weddings" },
  { key: "Bridal Prep", label: "Bridal Prep" },
  { key: "Asoebi Moments", label: "Asoebi Moments" },
  { key: "Social Content", label: "Social Content" },
] as const;

const layoutSpan: Record<string, string> = {
  feature: "sm:col-span-8",
  wide: "sm:col-span-6",
  tall: "sm:col-span-4",
  square: "sm:col-span-4",
};

export function WorkGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("All");

  const shown = useMemo(
    () => (filter === "All" ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  );

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

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-flow-row-dense sm:grid-cols-12 sm:gap-5">
          {shown.map((project) => (
            <ProjectCard key={project.slug} project={project} className={layoutSpan[project.layout]} />
          ))}
        </div>

        {shown.length === 0 ? <p className="mt-16 font-sans text-sm text-bone">Nothing in this category yet, check back soon.</p> : null}
      </div>
    </section>
  );
}
