import { MediaFrame } from "./media-frame";
import { ProjectCard } from "./project-card";
import { Reveal } from "./reveal";
import { TransitionLink } from "./transition";
import { formatDate } from "@/lib/utils";
import { getAdjacentProjects, type Project } from "@/lib/projects";

export function ProjectDetail({ project }: { project: Project }) {
  const related = getAdjacentProjects(project.slug, 2);

  return (
    <article className="bg-ink">
      <div className="flex justify-center px-4 pb-10 pt-28 sm:px-10 sm:pt-36">
        <div className="h-[62vh] w-full max-w-5xl sm:h-[74vh]">
          <MediaFrame media={project.hero} fit="contain" priority sizes="90vw" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <Reveal>
          <h1 className="font-serif text-h1 text-paper">{project.title}</h1>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-paper/10 py-6 font-sans text-sm sm:grid-cols-4">
            <div>
              <dt className="text-paper/40">Category</dt>
              <dd className="mt-1 text-paper">{project.category}</dd>
            </div>
            <div>
              <dt className="text-paper/40">Date</dt>
              <dd className="mt-1 text-paper">{formatDate(project.date)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-paper/40">Services</dt>
              <dd className="mt-1 text-paper">{project.services.join(", ")}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal className="mt-12 max-w-prose space-y-6 font-sans text-lg leading-relaxed text-bone">
          {project.story.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Reveal>
      </div>

      {project.gallery.length ? (
        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-4 px-6 sm:grid-cols-3 sm:gap-6 sm:px-10">
          {project.gallery.map((item, index) => (
            <MediaFrame key={index} media={item} className={index === 0 ? "col-span-2 sm:col-span-1" : undefined} />
          ))}
        </div>
      ) : null}

      <div className="mx-auto mt-24 max-w-6xl border-t border-paper/10 px-6 pb-28 pt-16 sm:px-10">
        <h2 className="font-serif text-h2 text-paper">More stories.</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {related.map((item) => (
            <ProjectCard key={item.slug} project={item} />
          ))}
        </div>

        <TransitionLink
          href="/contact"
          className="mt-16 inline-block border border-paper/30 px-7 py-4 font-sans text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:border-paper"
        >
          Start your story
        </TransitionLink>
      </div>
    </article>
  );
}
