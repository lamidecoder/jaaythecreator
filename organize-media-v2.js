#!/usr/bin/env node
/**
 * organize-media.js
 *
 * Solves one problem: getting your raw photos and videos onto the site
 * without renaming anything or manually editing code.
 *
 * HOW TO USE
 * 1. Drop your video and photo files straight into media-inbox/. No
 *    subfolders, no renaming, exactly as your camera or phone named them.
 * 2. Run:  node organize-media.js   (or  npm run media)
 *
 * Each file becomes its own piece on the site, automatically. This
 * script now writes directly into lib/projects.ts, no copy-pasting
 * needed. Title, category, and the write-up still get placeholder text
 * marked REPLACE right there in the file, since only you can write
 * those, but the piece is live on the site immediately either way.
 *
 * WHAT IT DOES
 * - Copies each file into public/media/work/<slug>/hero.<ext>, where
 *   <slug> is built from the filename itself. Your originals in
 *   media-inbox/ are left untouched, nothing is ever deleted.
 * - Inserts a new entry directly into the "projects" array in
 *   lib/projects.ts for every file that doesn't already have one.
 * - Safe to re-run any time. Pieces that already exist (checked by
 *   slug, not just by file) are left alone, so dropping in a few new
 *   files and running it again only adds what's new.
 * - If lib/projects.ts has been edited enough that this script can't
 *   find a safe place to insert (rare), it falls back to writing
 *   lib/projects.new.ts instead, same as before, so nothing is lost.
 *
 * PORTRAIT / SQUARE CLIPS
 * Defaults to 16:9. Add a hint to the FILENAME for anything else:
 * "emerald_look_portrait.mp4" or "..._9x16.mp4" for vertical/phone
 * footage, "..._square.mp4" for square.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = __dirname;
const INBOX = path.join(ROOT, "media-inbox");
const MEDIA_OUT = path.join(ROOT, "public", "media", "work");
const PROJECTS_FILE = path.join(ROOT, "lib", "projects.ts");
const SNIPPET_OUT = path.join(ROOT, "lib", "projects.new.ts");

const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".webm"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function hasFfmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const FFMPEG_AVAILABLE = hasFfmpeg();
if (!FFMPEG_AVAILABLE) {
  console.log(
    "Note: ffmpeg isn't installed, so videos will be copied as-is. This works for most phone videos, but if one recorded in HEVC (\"High Efficiency\") won't play, install ffmpeg for guaranteed compatibility: winget install ffmpeg\n",
  );
}

// Matches the array's closing bracket right before the helper functions,
// e.g. "\n];\n\nexport function getProject". Whitespace-flexible so small
// formatting differences (extra blank lines, Prettier, etc.) don't break it.
const INSERT_MARKER = /(\]\s*;\s*\n\s*export function getProject)/;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const MAX_SLUG_LENGTH = 40;

function shortFallbackSlug(projectsSource, usedThisRun) {
  let n = 1;
  while (true) {
    const candidate = "piece-" + n;
    if (!projectsSource.includes(`slug: "${candidate}"`) && !usedThisRun.has(candidate)) {
      return candidate;
    }
    n++;
  }
}

function titleCase(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalizeSeparators(name) {
  return name.replace(/[_-]+/g, " ");
}

function detectAspect(name) {
  const lower = normalizeSeparators(name).toLowerCase();
  if (/\b(portrait|9x16|vertical)\b/.test(lower)) return "9:16";
  if (/\b(square|1x1)\b/.test(lower)) return "1:1";
  return "16:9";
}

function stripHints(name) {
  return normalizeSeparators(name)
    .replace(/\b(portrait|9x16|vertical|square|1x1)\b/gi, "")
    .trim();
}

function isMediaFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return VIDEO_EXT.has(ext) || IMAGE_EXT.has(ext);
}

function layoutForAspect(aspect) {
  if (aspect === "9:16") return "tall";
  if (aspect === "1:1") return "square";
  return "wide";
}

function indentSnippet(snippet) {
  return snippet
    .split("\n")
    .map((line) => "  " + line)
    .join("\n");
}

if (!fs.existsSync(INBOX)) {
  fs.mkdirSync(INBOX, { recursive: true });
  console.log("Created media-inbox/. Drag your files straight in there (no subfolders needed) and run this again.");
  process.exit(0);
}

const files = fs
  .readdirSync(INBOX, { withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => d.name)
  .filter((f) => !f.startsWith(".") && isMediaFile(f));

if (files.length === 0) {
  console.log("media-inbox/ is empty. Drag your video and photo files in there and run this again.");
  process.exit(0);
}

fs.mkdirSync(MEDIA_OUT, { recursive: true });

const projectsSource = fs.existsSync(PROJECTS_FILE) ? fs.readFileSync(PROJECTS_FILE, "utf8") : "";

const snippets = [];
const usedThisRun = new Set();
let newCount = 0;
let skippedCount = 0;

for (const file of files) {
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const type = VIDEO_EXT.has(ext.toLowerCase()) ? "video" : "image";
  const aspect = detectAspect(base);
  let slug = slugify(stripHints(base)) || "piece";
  if (slug.length > MAX_SLUG_LENGTH) {
    // Filenames from download tools (Instagram savers, WhatsApp exports)
    // often embed a long cryptic ID. A slug built from that is unusable
    // as a URL, so fall back to a short generic one instead.
    slug = shortFallbackSlug(projectsSource, usedThisRun);
  }
  usedThisRun.add(slug);

  const alreadyHasEntry = projectsSource.includes(`slug: "${slug}"`);
  if (alreadyHasEntry) {
    skippedCount++;
    continue;
  }

  const destDir = path.join(MEDIA_OUT, slug);
  let destName = type === "video" && FFMPEG_AVAILABLE ? "hero.mp4" : "hero" + ext;
  let destPath = path.join(destDir, destName);

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destDir, { recursive: true });
    let converted = false;

    if (type === "video" && FFMPEG_AVAILABLE) {
      try {
        execSync(
          `ffmpeg -y -i "${path.join(INBOX, file)}" -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "${destPath}"`,
          { stdio: "ignore" },
        );
        converted = true;
      } catch {
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        console.log(`  (ffmpeg couldn't convert "${file}", copying the original file instead)`);
      }
    }

    if (!converted) {
      destName = "hero" + ext;
      destPath = path.join(destDir, destName);
      fs.copyFileSync(path.join(INBOX, file), destPath);
    }
  }

  newCount++;
  const title = titleCase(slug);
  const layout = layoutForAspect(aspect);

  const snippet = `{
  slug: "${slug}",
  title: "${title}", // REPLACE with the real title
  category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
  date: "${new Date().toISOString().slice(0, 10)}", // REPLACE with the real date
  services: ["Wedding"], // REPLACE
  excerpt: "REPLACE with a one-line summary.",
  featured: false,
  layout: "${layout}",
  hero: {
    type: "${type}",
    aspect: "${aspect}",
    alt: "REPLACE — describe this shot for screen readers",
    src: "/media/work/${slug}/${destName}",
    placeholderTone: 1,
  },
  gallery: [],
  story: [
    "REPLACE with the first story paragraph.",
  ],
},`;

  snippets.push(snippet);
  console.log(`Done: "${file}" -> public/media/work/${slug}/${destName}  (nothing renamed by hand)`);
}

if (skippedCount > 0) {
  console.log(`Skipped ${skippedCount} file${skippedCount === 1 ? "" : "s"} that already have an entry in lib/projects.ts.`);
}

if (snippets.length === 0) {
  console.log("\nNothing new to process.");
  process.exit(0);
}

const insertion = snippets.map(indentSnippet).join("\n\n") + "\n";

if (INSERT_MARKER.test(projectsSource)) {
  const updated = projectsSource.replace(INSERT_MARKER, `${insertion}$1`);
  fs.writeFileSync(PROJECTS_FILE, updated);
  console.log(`\n${newCount} new piece${newCount === 1 ? "" : "s"} added directly to lib/projects.ts. Refresh your dev server to see them.`);
  console.log("Each one still has REPLACE placeholders for title, category, and the write-up, open lib/projects.ts to fill those in.");
} else {
  fs.mkdirSync(path.dirname(SNIPPET_OUT), { recursive: true });
  const fileContent = `// Auto-generated by organize-media.js — ${new Date().toISOString()}
//
// Could not find a safe spot to insert these into lib/projects.ts
// automatically (it may have been restructured), so they're here
// instead. Copy each object below into the "projects" array, then
// replace anything marked REPLACE.

${snippets.join("\n\n")}
`;
  fs.writeFileSync(SNIPPET_OUT, fileContent);
  console.log(`\n${newCount} new piece${newCount === 1 ? "" : "s"}. Couldn't auto-insert into lib/projects.ts, so entries were written to lib/projects.new.ts instead, copy them over manually.`);
}
