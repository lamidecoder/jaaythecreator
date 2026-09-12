# Media folder

This is where real photos and films go once you have them. Nothing here yet,
which is why the site currently shows its editorial placeholder tones
instead of pictures.

## Suggested structure

```
public/media/
  projects/
    freya-tom/
      hero.mp4
      hero-poster.jpg
      gallery-1.jpg
      gallery-2.mp4
    aisha-daniel/
      hero.mp4
      ...
  gallery/
    g1.jpg
    g2.jpg
    ...
```

## Wiring a file in

Open `lib/projects.ts` (or `lib/gallery.ts` for the standalone gallery) and
add a `src` to the relevant entry, for example:

```ts
hero: {
  type: "video",
  aspect: "9:16",
  alt: "Freya and Tom's first look in a Cotswolds barn doorway",
  src: "/media/projects/freya-tom/hero.mp4",
  poster: "/media/projects/freya-tom/hero-poster.jpg",
},
```

The moment `src` is set, the real file renders in place of the placeholder,
at whatever `aspect` you declare, no other code changes needed.

## A note on video weight

Wedding films get long and heavy fast. For anything beyond a short teaser
clip, a video CDN (Cloudinary, Mux, or Bunny Stream all have generous free
tiers) will serve much faster than hosting raw files here, especially once
this is live. `next.config.mjs` has a commented example for pointing
`next/image` at an external host if you go that route for photos too.
