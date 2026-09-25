import { TransitionLink } from "./transition";
import { MagneticButton } from "./magnetic-button";
import { InstagramIcon, EmailIcon, TikTokIcon } from "./social-icons";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative bg-ink px-6 pb-10 pt-24 sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <p className="max-w-3xl font-serif text-h1 leading-[1.05] text-paper">
          {"Let's keep yours."}
        </p>
        <p className="mt-6 max-w-md font-sans text-base text-bone">
          {"Tell us about the day and we'll take it from there."}
        </p>

        <MagneticButton className="mt-10">
          <TransitionLink
            href="/contact"
            className="inline-flex items-center gap-3 border border-paper/30 px-7 py-4 font-sans text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:border-paper"
          >
            Start your story
          </TransitionLink>
        </MagneticButton>

        <div className="mt-24 grid grid-cols-2 gap-8 border-t border-paper/10 pt-10 font-sans text-sm text-bone sm:grid-cols-4">
          <div>
            <InstagramIcon className="text-paper/40" />
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-paper transition-colors hover:text-wine-soft"
            >
              {site.instagram.handle}
            </a>
          </div>
          <div>
            <EmailIcon className="text-paper/40" />
            <a href={`mailto:${site.email}`} className="mt-3 inline-block text-paper transition-colors hover:text-wine-soft">
              {site.email}
            </a>
          </div>
          <div>
            <TikTokIcon className="text-paper/40" />
            <a
              href={site.tiktok.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-paper transition-colors hover:text-wine-soft"
            >
              {site.tiktok.handle}
            </a>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-paper/40">Location</p>
            <p className="mt-2 text-paper">{site.location}</p>
          </div>
        </div>

        <div className="mt-16 border-t border-paper/10 pt-10">
          <p className="font-sans text-sm text-bone">
            {"Looking for gele styling specifically? "}
            <a
              href="https://jaygele.com"
              target="_blank"
              rel="noreferrer"
              className="text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:text-wine-soft hover:decoration-wine-soft"
            >
              Visit jaygele.com
            </a>
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-4 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
            <span className="mx-2 text-paper/20">·</span>
            Built by{" "}
            <a
              href="https://www.nexushousehq.com/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-paper/70"
            >
              NexusHouseUK
            </a>
          </p>
          <div className="flex gap-6">
            {site.nav.map((item) => (
              <TransitionLink key={item.href} href={item.href} className="transition-colors hover:text-paper/70">
                {item.label}
              </TransitionLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
