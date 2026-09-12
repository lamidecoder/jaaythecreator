# Jaaythecreator

A Next.js portfolio site for Jaaythecreator, wedding films and photography,
based in London.

## Quick start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. For a production build:

```bash
npm run build
npm run start
```

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Motion (the
renamed Framer Motion), GSAP + ScrollTrigger for the hero's scroll sequence,
and Lenis for smooth scrolling.

## Editing content

Everything editorial lives in `lib/`, as plain typed data, not a CMS:

- `lib/site.ts` — name, email, phone, WhatsApp link, Instagram, nav links.
  The fields marked `REPLACE` are placeholders (a placeholder domain,
  a placeholder phone number) and should be swapped for the real ones
  before launch.
- `lib/projects.ts` — every project in Work. Add a new entry (copy an
  existing one as a template) and it appears in the showcase, the work
  archive, and gets its own `/work/<slug>` page automatically.
- `lib/services.ts` — the six services listed on the homepage and
  `/services`.
- `lib/gallery.ts` — the standalone photo set on `/gallery`.

## Adding real photos and video

The easy way: make a folder per story inside `media-inbox/` (any name you
like), drop your files in with whatever names your camera or phone gave
them, then run:

```bash
npm run media
```

It copies everything into `public/media/work/<slug>/`, renamed and placed
correctly, no manual renaming needed. It also writes `lib/projects.new.ts`
with a ready-to-paste entry for each story, already pointing at the right
files, with the parts only you can write (title, location, the write-up)
marked `REPLACE`. Copy what you want into the `projects` array in
`lib/projects.ts`, then delete `projects.new.ts`. See the comment at the
top of `organize-media.js` for the full rundown, including how to flag a
portrait or square clip.

Nothing is wired to stock photography or sample video. Every project and
gallery image currently shows one of eight quiet gradient tones instead,
at its correct aspect ratio, so the site never looks broken while media is
still being gathered. See `public/media/README.md` for the manual, one-
file-at-a-time version of the same idea.

## The contact form

`/contact` posts to `app/api/contact/route.ts`. Right now that route
validates the submission and returns success, but does not actually send
or store anything yet, there's a commented example in that file for wiring
up an email provider like Resend once you have an API key. Worth deciding
before launch, since right now a submitted enquiry doesn't reach anyone.

One thing worth flagging: an earlier note on this project mentioned a
preference for an email-only contact page, no form. This build follows the
detailed brief, which asks for a full booking form, so that's what's here,
with direct email, WhatsApp, and Instagram links sitting right alongside it
on the page for anyone who'd rather not fill it in. If you'd actually
prefer to drop the form entirely, that's a quick change, just say so.

## Deployment

Built for Vercel. Push to a Git repository, import it in Vercel, and it
should deploy with no configuration beyond setting `lib/site.ts`'s `url`
to the real domain once one exists.

## Honest notes on a few decisions

- **Page transitions** use a curtain wipe (fade to the site's ink colour,
  swap the route underneath, fade back in) rather than the browser's View
  Transitions API. View Transitions would allow a more literal morph
  between pages, but browser support is still inconsistent enough that it
  felt like the wrong foundation to build the whole site on. It's a
  reasonable future upgrade once support is further along.
- **Video behaviour**: project and gallery videos autoplay muted on loop
  once scrolled into view, and pause off screen, rather than requiring a
  tap. On very slow connections this can mean a moment of the poster image
  before playback starts, which is normal `preload="none"` behaviour.
- **This build ships with placeholder media throughout.** It's built to
  look intentional and finished as-is, but real footage and photography
  will make a genuine difference once it's in.
