#!/usr/bin/env node
/**
 * sync-media-entries.js
 *
 * For when files have been placed directly into public/media/work/<folder>/
 * (by hand, or any other way) rather than through media-inbox +
 * organize-media.js. This scans that folder directly and creates a
 * lib/projects.ts entry for anything that doesn't have one yet, using
 * whichever video or photo it finds inside each folder, whatever it's
 * actually named.
 *
 * Safe to re-run any time, folders that already have a matching entry
 * are left alone.
 *
 * Run once from your project root:  node sync-media-entries.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const MEDIA_WORK = path.join(ROOT, "public", "media", "work");
const PROJECTS_FILE = path.join(ROOT, "lib", "projects.ts");

const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".webm"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function normalizeSeparators(name) {
  return name.replace(/[_-]+/g, " ");
}

function detectAspect(name) {
  const lower = normalizeSeparators(name).toLowerCase();
  if (/\b(portrait|9x16|vertical)\b/.test(lower)) return "9:16";
  if (/\b(square|1x1)\b/.test(lower)) return "1:1";
  return "16:9";
}

function layoutForAspect(aspect) {
  if (aspect === "9:16") return "tall";
  if (aspect === "1:1") return "square";
  return "wide";
}

function titleCase(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function slugify(name) {
  return (
    name
      .toLowerCase()
      .replace(/[_\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "piece"
  );
}

if (!fs.existsSync(MEDIA_WORK)) {
  console.log("public/media/work doesn't exist yet, nothing to sync.");
  process.exit(0);
}
if (!fs.existsSync(PROJECTS_FILE)) {
  console.log("lib/projects.ts not found, can't continue.");
  process.exit(1);
}

const projectsSource = fs.readFileSync(PROJECTS_FILE, "utf8");
const folders = fs
  .readdirSync(MEDIA_WORK, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

if (folders.length === 0) {
  console.log("public/media/work is empty, nothing to sync.");
  process.exit(0);
}

const snippets = [];
let newCount = 0;
let skippedCount = 0;

for (const folder of folders) {
  const slug = slugify(folder);

  if (projectsSource.includes(`slug: "${slug}"`)) {
    skippedCount++;
    continue;
  }

  const folderPath = path.join(MEDIA_WORK, folder);
  const filesInFolder = fs.readdirSync(folderPath).filter((f) => !f.startsWith("."));
  const videoFile = filesInFolder.find((f) => VIDEO_EXT.has(path.extname(f).toLowerCase()));
  const imageFile = filesInFolder.find((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()));
  const mediaFile = videoFile || imageFile;

  if (!mediaFile) {
    console.log(`Skipping "${folder}" — no video or image file found inside it.`);
    continue;
  }

  const type = videoFile ? "video" : "image";
  const aspect = detectAspect(folder);
  const layout = layoutForAspect(aspect);
  const title = titleCase(slug);

  const snippet = `{
  slug: "${slug}",
  title: "${title}", // REPLACE with the real title
  category: "Wedding", // REPLACE — Wedding | Bridal Prep | Asoebi Moments | Social Content
  date: "${new Date().toISOString().slice(0, 10)}", // REPLACE with the real date
  services: ["Wedding"], // REPLACE
  excerpt: "REPLACE with a one-line summary.",
  featured: true,
  layout: "${layout}",
  hero: {
    type: "${type}",
    aspect: "${aspect}",
    alt: "REPLACE — describe this shot for screen readers",
    src: "/media/work/${folder}/${mediaFile}",
    placeholderTone: 1,
  },
  gallery: [],
  story: [
    "REPLACE with the first story paragraph.",
  ],
},`;

  snippets.push(snippet);
  newCount++;
  console.log(`Found: "${folder}/${mediaFile}" -> added as "${slug}"`);
}

if (skippedCount > 0) {
  console.log(`Skipped ${skippedCount} folder${skippedCount === 1 ? "" : "s"} that already have an entry.`);
}

if (snippets.length === 0) {
  console.log("\nNothing new to add.");
  process.exit(0);
}

const marker = /(\]\s*;\s*\n\s*export function getProject)/;
if (!marker.test(projectsSource)) {
  console.log("\nCouldn't find a safe spot to insert into lib/projects.ts, no changes were made, nothing was risked.");
  process.exit(1);
}

const insertion =
  snippets
    .map((s) =>
      s
        .split("\n")
        .map((l) => "  " + l)
        .join("\n"),
    )
    .join("\n\n") + "\n";
const updated = projectsSource.replace(marker, insertion + "$1");
fs.writeFileSync(PROJECTS_FILE, updated);
console.log(`\n${newCount} new piece${newCount === 1 ? "" : "s"} added directly to lib/projects.ts, and marked featured so they show on the homepage right away.`);
