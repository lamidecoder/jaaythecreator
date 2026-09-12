import { TransitionLink } from "@/components/transition";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="font-sans text-xs uppercase tracking-[0.25em] text-paper/40">404</p>
      <h1 className="mt-6 max-w-md font-serif text-h1 text-paper">{"This scene didn't make the final cut."}</h1>
      <p className="mt-6 max-w-sm font-sans text-base text-bone">
        {"The page you're looking for isn't here. Let's get you back to the story."}
      </p>
      <TransitionLink
        href="/"
        className="mt-10 border border-paper/30 px-7 py-4 font-sans text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:border-paper"
      >
        Back to home
      </TransitionLink>
    </div>
  );
}
