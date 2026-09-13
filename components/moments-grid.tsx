import { projects } from "@/lib/projects";
import { TransitionLink } from "./transition";
import { Reveal } from "./reveal";
import { MagazineCard } from "./magazine-card";

/** Slug, grid column span (of 12), panel height, and where object-cover
 * anchors its crop — set by hand here so the layout reads as a
 * magazine page rather than a uniform repeating grid. Add or swap
 * slugs and spans freely; spans in the same row should add up to 12.
 * objectPosition defaults to "center" if omitted. */
const PANELS: { slug: string; span: string; height: string; objectPosition?: string }[] = [
  { slug: "emerald-and-gold", span: "sm:col-span-7", height: "h-[55vh] sm:h-[75vh]" },
  { slug: "the-ivory-hour", span: "sm:col-span-5", height: "h-[55vh] sm:h-[75vh]" },
  { slug: "rose-and-marble", span: "sm:col-span-8", height: "h-[50vh] sm:h-[60vh]" },
  { slug: "piece-20", span: "sm:col-span-4", height: "h-[50vh] sm:h-[60vh]" },
  { slug: "piece-12", span: "sm:col-span-12", height: "h-[70vh] sm:h-[100vh]", objectPosition: "object-top" },
];

export function MomentsGrid() {
  const panels = PANELS.map((p) => {
    const project = projects.find((proj) => proj.slug === p.slug);
    return project ? { ...p, project } : null;
  }).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (panels.length === 0) return null;

  return (
    <section className="bg-ink px-6 pb-28 pt-8 sm:px-10 sm:pt-16">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl font-serif text-h1 text-paper">Selected moments.</h2>
            <TransitionLink
              href="/work"
              className="font-sans text-xs uppercase tracking-[0.2em] text-paper/60 transition-colors hover:text-paper"
            >
              View all work
            </TransitionLink>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-5">
          {panels.map(({ slug, span, height, objectPosition, project }) => (
            <MagazineCard key={slug} project={project} span={span} sizeClass={height} objectPosition={objectPosition} />
          ))}
        </div>
      </div>
    </section>
  );
}
