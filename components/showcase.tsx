import { projects } from "@/lib/projects";
import { ProjectCard } from "./project-card";
import { Reveal } from "./reveal";
import { TransitionLink } from "./transition";

const layoutSpan: Record<string, string> = {
  feature: "sm:col-span-8",
  wide: "sm:col-span-6",
  tall: "sm:col-span-4",
  square: "sm:col-span-4",
};

export function Showcase() {
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);
  const shown = [...featured, ...rest].slice(0, 6);

  return (
    <section className="bg-ink px-6 pb-28 pt-8 sm:px-10 sm:pt-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl font-serif text-h1 text-paper">Selected stories.</h2>
            <TransitionLink
              href="/work"
              className="font-sans text-xs uppercase tracking-[0.2em] text-paper/60 transition-colors hover:text-paper"
            >
              View all work
            </TransitionLink>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-flow-row-dense sm:grid-cols-12 sm:gap-5">
          {shown.map((project, index) => (
            <ProjectCard key={project.slug} project={project} priority={index === 0} className={layoutSpan[project.layout]} />
          ))}
        </div>
      </div>
    </section>
  );
}
