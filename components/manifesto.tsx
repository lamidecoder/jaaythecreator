import { Reveal } from "./reveal";

export function Manifesto() {
  return (
    <section className="bg-ink px-6 py-24 sm:px-10 sm:py-32">
      <Reveal className="mx-auto max-w-4xl">
        <p className="font-serif text-h1 italic leading-tight text-paper/90">
          {"Every wedding is its own film. We just help you notice the parts worth keeping."}
        </p>
      </Reveal>
    </section>
  );
}
